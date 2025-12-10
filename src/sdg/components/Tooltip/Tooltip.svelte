<script>
    import {Utils} from "../utils";
    import {onMount, tick} from "svelte";
    import Icon from "../../bases/Icon/Icon.svelte";
    import gridConfig from '../../../sdg/scss/settings/grid.json';
    let {
        text,
        description,
        requestedPosition = "right",
        preventOuterEventClosing = false,
        displayMode = "popover"
    } = $props()
    const
        defaultTranslateY = "calc(-50% + 8px)",
        defaultTranslateX = "-50%"
    ;
    let tooltipPanel = $state(),
        tooltipId = Utils.generateId("tooltip"),
        tooltipContainer,
        tooltipButton = $state(),
        modale = $state(),
        display = $state(false),
        visible = $state(false),
        translateX = $state(defaultTranslateX),
        translateY = $state(defaultTranslateY),
        position = $state(requestedPosition)
    ;

    onMount(_ => {
        tooltipContainer
            .addEventListener("click", markInnerEvent)
        console.log("sm bp" , getSmBreakpoint(gridConfig))
    })

    $effect(_ => {
        if (!display) {
            visible = false
        }
    })

    async function showTooltip(e) {
        e.preventDefault();
        if (isModal()) {
            showModal()
        }
        else {
            showPopover()
        }
    }

    function closeTooltip(e) {
        if (isModal()) {
            modale.close();
        }
        else {
            display = false;
        }
    }

    function isModal() {
        return isMobile() || displayMode === "modal"
    }

    function toggleModal(e) {
        const body = document.querySelector("body");
        body.style.overflow = modale.open ? "hidden" : "";
    }

    async function showModal(e) {
        modale.showModal();
    }

    function getSmBreakpoint(gridConfig) {
        return parseInt(gridConfig.lg.breakpoint.sm.replace("px", ""));
    }

    function isMobile() {
        const bounds = getScreenBounds();
        const isMobile = bounds.right <= getSmBreakpoint(gridConfig);
        console.log("isMobile ? : " + isMobile, bounds.right, getSmBreakpoint(gridConfig))
        return isMobile;
    }

    async function showPopover(e) {
        if (display) {
            display=false;
            return;
        }
        display = true
        await tick()

        let start = requestedPosition,
            current =  start
        ;
        await waitForNextFrame()
        console.log("Placement initial : " + start, requestedPosition)
        let tries = getTriesOrder(start);
        while (true) {
            position = current
            await waitForNextFrame()
            if (tryPlacement(current)) {
                visible = true;
                break;
            }
            const index = tries.indexOf(current)
            current = tries[(index + 1) % tries.length]
            if (current === start) {
                fallBack()
                break;
            }
        }
        await waitForNextFrame()
    }

    function getTriesOrder(placement) {
        return {
            "right": ["right", "top", "bottom"],
            "top": ["top", "bottom", "right"],
            "bottom": ["bottom", "top", "right"]
        }[placement]
    }

    function waitForNextFrame() {
        console.log("Waiting for next frame")
        return new Promise(resolve => {
            window.requestAnimationFrame(resolve);
        });
    }

     function tryPlacement(placement) {
        console.log("Tentative de placement selon " + placement )
        let result = !isElementOverflowing(tooltipPanel, placement);
        if (result) {
            result = adjustCrossAxis(tooltipPanel, placement);
        }
        console.log("Placement selon " + placement + " : "  + result )
        return result;
    }

    function getOtherAxisPlacements(placement) {
        return placement === "right"
                ? ["top", "bottom"]
                : ["right", "left"];
    }

    function adjustCrossAxis(tooltipPanel, position) {
        translateX = defaultTranslateX,
        translateY = defaultTranslateY
        let otherAxisPopsitions = getOtherAxisPlacements(position);
        let adjustable = true;

        otherAxisPopsitions.forEach(otherAxisPosition => {
            // await waitForNextFrame();
            if (!adjustable) return;
            console.log(`adjustPin ${otherAxisPosition}`)
            if (!isElementOverflowing(tooltipPanel, otherAxisPosition)) {
                console.log(`adjustPin ${otherAxisPosition} : nothing to adjust `)
                return;
            }
            const gap = getScreenGap(tooltipButton, otherAxisPosition);
            console.log(`adjustPin ${otherAxisPosition} : gap value for button : ${gap}`, gap < 0 )
            if (gap < 0) {
                console.log(`adjustPin ${position} : button overflowwing - no adjustement enabled`)
                adjustable = false;
                return;
            }
            switch (otherAxisPosition) {
                case "top":
                    translateY = `-${gap}px`
                    break;
                case "bottom":
                    translateY = `calc(-100% + 20px + ${gap}px)`
                    break;
                case "right":
                    translateX = `${gap + 16}px`
                    break;
                case "left":
                    translateX = `-${gap}px`
                    break;
            }
        })
        console.log(`adjustPin ${position} : adjustable : ${adjustable}`)
        return adjustable;
    }

    $inspect("translateX", translateX)
    $inspect("translateY", translateY)
    $inspect("position", position)

    function fallBack() {
        console.log("Fallback")
    }

    function closeIfClickOutEvent(e) {
        if (preventOuterEventClosing) return
        if (e.tooltipContainer === tooltipContainer) return;
        display = false;
    }

    function closeIfBlur(e) {
        if (preventOuterEventClosing) return
        display = false
    }

    function closeIfFocusOutEvent(e) {
        display = false;
    }

    function markInnerEvent(e) {
        e.tooltipContainer = tooltipContainer;
    }

    function isElementOverflowing(element, position) {
        const gap = getScreenGap(element, position);
        const overflow = gap < 0;
        console.log(`Overflow for ${consoleName(element)} in position ${position} : ${overflow} (gap: ${gap})`)
        return overflow;
    }

    function consoleName(element) {
        return element == tooltipButton ? "button" : "panel"
    }

    function getScreenBounds() {
        return {
            "right" : document.documentElement.clientWidth,
            "top" : 0,
            "bottom": document.documentElement.clientHeight,
            "left" : 0
        }
    }

    function getScreenGap(element, position, offset = 0) {
        const bounds = getScreenBounds();
        // Récupère les coordonnées de l'élément par rapport au viewport
        const rect = element.getBoundingClientRect();
        console.log(`element.getBoundingClientRect() for ${consoleName(element)} in position ${position}`, element.getBoundingClientRect())
        const border = bounds[position]
        // console.log("border",border)
        switch (position) {
            case "right":
            case "bottom":
                return (border - offset) - rect[position];
            case "top" :
            case "left" :
                return rect[position] - (border - offset)
        }
    }

</script>

<svelte:document
        onclick={closeIfClickOutEvent}
/>
<svelte:window
        onblur={closeIfBlur}
/>

<span class="qc-tooltip"
      bind:this={tooltipContainer}
      onfocusout={markInnerEvent}
>
    {#if text}
    <!-- svelte-ignore a11y_click_events_have_key_events -->
     <span class="qc-tooltip-text"
           onclick={showTooltip}
           role="button"
           tabindex="-1"
        >{@html text}</span>
    {/if}
    {#if description}
     <div class="qc-tooltip-container qc-tooltip-{position} qc-scrollbar"
          class:qc-tooltip-popover={!isModal()}
          class:qc-tooltip-modal={isModal()}
          style:--max-height={isModal() ? "320px" : "160px"};
        >
         <a role="button"
            class="qc-tooltip-button"
            href="#top"
            onclick={showTooltip}
            bind:this={tooltipButton}
            aria-describedby={tooltipId}
         >
            <Icon type="info-tooltip" size="sm" />
        </a>
         {#if displayMode === "popover" && display}
         <div class="qc-tooltip-pin"
              class:qc-tooltip-visible={visible}
            >
             <svg
                 width="9"
                 height="15"
                 viewBox="0 0 9 15"
                 fill="none"
                 xmlns="http://www.w3.org/2000/svg">
                <style>
                    .triangle {
                        fill: var(--qc-color-background);
                    }
                    .stroke {
                        fill: var(--qc-color-grey-light);
                    }
                </style>
                <path
                        class="triangle"
                        d="M8.02002 14.1667L1.35335 7.50004L8.02002 0.833374L8.02002 14.1667Z"/>
                <path
                        class="stroke"
                        d="M1.35335 7.5L8.02002 14.1667L8.02002 15H7.02002V14.5118L1.90735e-05 7.5L7.02002 0.488157V0L8.02002 3.64262e-08L8.02002 0.833335L1.35335 7.5Z"/>
            </svg>
         </div>
             {@render tooltipPanelSnippet("popover")}
         {/if}
         <dialog bind:this={modale}
                 ontoggle={toggleModal}
            >
            <div class="qc-container">
                {@render tooltipPanelSnippet("modal")}
            </div>
         </dialog>
     </div>
    {/if}
</span>

{#snippet tooltipPanelSnippet(displayMode)}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <div role="tooltip"
         class="qc-tooltip-panel"
         class:qc-tooltip-visible={visible}
         class:qc-shading-1={displayMode === "popover"}
         bind:this={tooltipPanel}
         style:--translateY={translateY}
         style:--translateX={translateX}
         id={tooltipId}
         onkeydown={e => {
             if (isModal()) return;
             if (e.key === "Escape") {
                 closeTooltip(e);
             }
         }}
    >
        <div class="qc-tooltip-content">
            {@html description}
        </div>
        <a role="button"
           class="qc-tooltip-xclose"
           href="#top"
           onclick={closeTooltip}
        >
            <Icon type="xclose"
                  color="blue-piv"
                  size="sm" />
        </a>
    </div>
{/snippet}


<style>
    .qc-tooltip {
        display: inline-flex;
        align-items: center;
        --pin-gap: 4px;
        --pin-height: 9px;
        --pin-base: 15px;
    }
    .qc-tooltip-text {
        border-bottom: 1px dashed var(--qc-color-text-primary);
        cursor: pointer;
    }
    .qc-tooltip-button {
        align-self: center;
        height: 16px;
        width: 16px;
        line-height: 16px;
        margin-left: 4px;
        display: block;
        position: relative;
    }
    .qc-tooltip-container {
        position: relative;
    }
    .qc-tooltip-pin {
        position: absolute;
        top:0;
        left: calc(100% + var(--pin-gap) + 1px);
        z-index: 200;
        width: var(--pin-height);
        height: var(--pin-base);
    }

    svg {
        display: block;
    }

    .qc-tooltip-content {
        overflow-y: auto;
        max-height:calc(var(--max-height) - 48px);
        scrollbar-gutter: stable;
        padding-right:16px;
    }

    .qc-tooltip-content:focus-visible {
        outline: 2px solid var(--qc-color-blue-regular);
        outline-offset: 1px;
    }

    .qc-tooltip-xclose {
        position: absolute;
        right: 8px;
        top: 8px;
        line-height: 16px;
        height: 16px;
    }


    dialog {
        top: auto;
        bottom: 0;
        left: 0;
        right: 0;
        max-width: 100%;
        width: 100%;
        height: auto;
        margin: 0;
        padding: 0;
        border: 1px solid var(--qc-color-grey-light);
        background: var(--qc-color-background);
        .qc-tooltip-panel {
            visibility: visible!important;
        }

        &::backdrop {
            background-color: rgba(var(--qc-color-blue-dark-rgb), .25)
        }

        .qc-tooltip-xclose {
            right: 0;
        }
    }

    .qc-tooltip-panel {
        position: relative;
        min-height: 68px;
        max-height: var(--max-height);
        background: var(--qc-color-background);
        color: var(--qc-color-text-primary);
        width: 100%;
        max-width: var(--qc-max-content-width);
        padding: 24px 0;
    }

    .qc-tooltip-popover {

        .qc-tooltip-content {
            padding-top: 2px;
        }
        .qc-tooltip-panel {
            visibility: hidden;
            position: absolute;
            min-width: 216px;
            max-width: 320px;
            padding: 22px 8px 24px 16px;
            width: max-content;
            border: 1px solid var(--qc-color-grey-light);
            transform: translateY(var(--translateY));
            top:0;
            left: calc(100% + var(--pin-gap) + var(--pin-height) - 1px);
            z-index:199;
        }

        &.qc-tooltip-bottom .qc-tooltip-panel {
            top: calc(100% + var(--pin-height) + var(--pin-gap));
            left:auto;
            transform: translateX(var(--translateX));
        }

        &.qc-tooltip-top .qc-tooltip-pin {
            top: calc(-100% - var(--pin-gap) + 2px);
            left: calc(var(--pin-height) - 1px);
            transform: rotate(-90deg);
        }

        &.qc-tooltip-bottom .qc-tooltip-pin {
            top: calc(100% + var(--pin-gap) - 1px);
            left: 8px;
            transform: rotate(90deg);
        }

        &.qc-tooltip-top .qc-tooltip-panel {
            /*display: none;*/
            top: 0;
            transform: translate(
                    var(--translateX),
                    calc(-100% - var(--pin-gap) - var(--pin-height))
            );
            left:auto;
        }
        .qc-tooltip-visible {
            visibility: visible;
        }
    }

    ::-webkit-scrollbar,
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb
    {
        height: 50%;
        margin-top: 10px;
        margin-right: -8px;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--qc-color-blue-piv);
    }

</style>