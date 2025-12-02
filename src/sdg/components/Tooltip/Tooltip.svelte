<script>
    import {Utils} from "../utils";
    import {onMount, tick} from "svelte";
    import Icon from "../../bases/Icon/Icon.svelte";
    import gridConfig from '../../../sdg/scss/settings/grid.json';
    let {
        text,
        description,
        requestedPosition = "top",
        preventOuterEventClosing = false,
        displayMode = "popover",
        icon = "information",
        descriptionId,
        slots,
        host,
        descriptionSlot,
        textSlot
    } = $props()
    const
        defaultTranslateY = "calc(-50% + 8px)",
        defaultTranslateX = "-50%"
    ;
    let isFr = Utils.getPageLanguage() === "fr",
        tooltipPanel = $state(),
        tooltipId = Utils.generateId("tooltip"),
        tooltipContainer,
        tooltipButton = $state(),
        modale = $state(),
        displayPopover = $state(false),
        visiblePopover = $state(false),
        displayModal = $state(false),
        translateX = $state(defaultTranslateX),
        translateY = $state(defaultTranslateY),
        position = $state(requestedPosition),
        mobileFlag = $state(false),
        forceModal = $state(false),
        modalFlag = $derived(mobileFlag || displayMode === "modal" || forceModal),
        hasDescription = $derived.by(_ => hasProperty(description, slots["description"], descriptionSlot)),
        hasText = $derived.by(_ => hasProperty(text, slots["text"], textSlot)),
        tooltipIcon = $derived( icon + "-tooltip"),
        labels = {
            tooltipButton: {
                ariaLabel: isFr ? "Afficher l'aide contextuelle" : "Display tooltip",
            },
            closeButton: {
                ariaLabel : isFr ? "Fermer l'aide contextuelle" : "Close tooltip"
            }
        }
    ;
    $inspect("modalFlag",modalFlag)

    function hasProperty(property, slotExist, snippet) {
        if (property) return true;
        if (slots) return slotExist !== undefined
        return snippet !== null
    }

    $effect(_ => {
        if (!["popover","modal"].includes(displayMode) ) {
            displayMode = "popover"
        }
    })
    $effect(_ => {
        if (!["information","question"].includes(icon) ) {
            icon = "information"
        }
    })
    $effect(_ => {
        if (description) return;
        if (!descriptionId) return;
        const target = document.getElementById(descriptionId);
        if (!target) return;
        description = target.innerHTML;
    })

    onMount(_ => {
        tooltipContainer
            .addEventListener("click", markInnerEvent)
        $inspect("sm bp" , getSmBreakpoint(gridConfig))
        setIsMobile()
        window.addEventListener("resize", setIsMobile)
    })

    $inspect("isMobile", mobileFlag)

    $effect(_ => {
        if (!displayPopover) {
            visiblePopover = false
        }
    })

    async function showTooltip(e) {
        forceModal = false;
        e.preventDefault();
        if (modalFlag) {
            showModal()
        }
        else {
            showPopover()
        }
    }

    function closeTooltip() {
        console.log("closeTooltip")
        if (modalFlag) {
            closeModale()
        }
        else {
            displayPopover = false;
        }
    }

    function closeModale() {
        if (!modale) return;

        modale.close();
        toggleModal();
        displayModal = false;
    }

    function toggleModal() {
        if (!modale) return;
        const body = document.querySelector("body");
        if (modale.open) {
            body.style.overflow = "hidden";
        }
        else {
            body.style.overflow = ""
        }
    }

    async function showModal(e) {
        displayModal = true;
        await tick()
        modale.showModal();
    }

    function getSmBreakpoint(gridConfig) {
        return parseInt(gridConfig.lg.breakpoint.sm.replace("px", ""));
    }

    function setIsMobile() {
        const bounds = getScreenBounds();
        mobileFlag = bounds.right <= getSmBreakpoint(gridConfig);
        return mobileFlag;
    }

    async function showPopover(e) {
        if (displayPopover) {
            displayPopover=false;
            return;
        }
        displayPopover = true
        await tick()
        let start = requestedPosition,
            current =  start
        ;
        await waitForNextFrame()
        // $inspect("Placement initial : " + start, requestedPosition)
        let tries = getTriesOrder(start);
        while (true) {
            position = current
            await waitForNextFrame()
            if (tryPlacement(current)) {
                visiblePopover = true;
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
        // $inspect("Waiting for next frame")
        return new Promise(resolve => {
            window.requestAnimationFrame(resolve);
        });
    }

     function tryPlacement(placement) {
        let result = !isElementOverflowing(tooltipPanel, placement);
        if (result) {
            result = adjustCrossAxis(tooltipPanel, placement);
        }
        // $inspect("Placement selon " + placement + " : "  + result )
        return result;
    }

    function getOtherAxisPositions(placement) {
        return placement === "right"
                ? ["top", "bottom"]
                : ["right", "left"];
    }

    function adjustCrossAxis(tooltipPanel, position) {
        translateX = defaultTranslateX,
        translateY = defaultTranslateY
        let otherAxisPositions = getOtherAxisPositions(position);
        let adjustable = true;

        otherAxisPositions.forEach(otherAxisPosition => {
            // await waitForNextFrame();
            if (!adjustable) return;
            //$inspect(`adjustPin ${otherAxisPosition}`)
            if (!isElementOverflowing(tooltipPanel, otherAxisPosition)) {
                //$inspect(`adjustPin ${otherAxisPosition} : nothing to adjust `)
                return;
            }
            const gap = getScreenGap(tooltipButton, otherAxisPosition);
            // console.log(`adjustPin ${otherAxisPosition} : gap value for button : ${gap}`, gap < 0 )
            if (gap < 0) {
                //$inspect(`adjustPin ${position} : button overflowwing - no adjustement enabled`)
                adjustable = false;
                return;
            }
            switch (otherAxisPosition) {
                case "top":
                    translateY = `-${gap}px`
                    break;
                case "bottom":
                    translateY = `calc(-100% + 16px + ${gap}px)`
                    break;
                case "right":
                    translateX = `calc(-100% + 16px + ${gap}px)`
                    break;
                case "left":
                    translateX = `-${gap}px`
                    break;
            }
        })
        //$inspect(`adjustPin ${position} : adjustable : ${adjustable}`)
        return adjustable;
    }

    function fallBack() {
        displayPopover = false;
        forceModal = true;
        showModal();
    }

    function closeOnTooltipBlur(e) {
        if (preventOuterEventClosing) return
        if (e.tooltipContainer === tooltipContainer) return;
        if (!host) return;
        if (host === e.target) return;
        closeTooltip()
    }

    function closeOnWindowBlur(e) {
        if (preventOuterEventClosing) return
        closeTooltip()
    }

    function markInnerEvent(e) {
        e.tooltipContainer = tooltipContainer;
    }

    function isElementOverflowing(element, position) {
        const gap = getScreenGap(element, position);
        const overflow = gap < 0;
        //$inspect(`Overflow for ${consoleName(element)} in position ${position} : ${overflow} (gap: ${gap})`)
        return overflow;
    }

    function consoleName(element) {
        return element === tooltipButton ? "button" : "panel"
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
        // console.log(`element.getBoundingClientRect() for ${consoleName(element)} in position ${position}`, element.getBoundingClientRect())
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

    function clickIconButton(e) {
        e.stopImmediatePropagation();
        tooltipButton.focus()
        tooltipButton.click()
    }
</script>

<svelte:document
        onclick={closeOnTooltipBlur}
        onfocusin={closeOnTooltipBlur}
/>
<svelte:window
        onblur={closeOnWindowBlur}
/>
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="qc-tooltip"
      bind:this={tooltipContainer}
      onfocusout={markInnerEvent}
      onkeydown={e => {
             //$inspect("keydown", e.key)
             if (modalFlag) return;
             if (e.key === "Escape") {
                 e.preventDefault()
                 closeTooltip(e);
             }
         }}
>
    <!-- svelte-ignore a11y_click_events_have_key_events -->
    {#if hasText}
     <span class="qc-tooltip-text"
           onclick={clickIconButton}
           tabindex="-1"
        >{@html text}{@render textSlot()}</span>
    {:else}
        <span>&zwj;</span>
    {/if}
    {#if hasDescription}

     <div class="qc-tooltip-container qc-tooltip-{position} qc-scrollbar"
          class:qc-tooltip-popover={!modalFlag}
          class:qc-tooltip-modal={modalFlag}
          style:--max-height={modalFlag ? "320px" : "160px"};
        >
         <!-- ajout d'une zone cliquable de 24px autour du bouton, pour des raisons d'accessibilité -->
         <!-- svelte-ignore a11y_click_events_have_key_events -->
         <div class="clickable-gutter"
              onclick={clickIconButton}
         ></div>
         <a role="button"
            class="qc-tooltip-button"
            href="#top"
            aria-label={labels.tooltipButton.ariaLabel}
            onclick={showTooltip}
            bind:this={tooltipButton}
            aria-describedby={tooltipId}
            onkeydown={e => {
             if (e.code === "Space") {
                 tooltipButton.click()
                 e.preventDefault();
             }
            }}
         >
            <Icon type={tooltipIcon} size="sm" />
        </a>
         {#if !modalFlag && displayPopover}
         <div class="qc-tooltip-pin"
              class:qc-tooltip-visible={visiblePopover}
              aria-hidden="true"
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
         {#if modalFlag && displayModal}
         <dialog bind:this={modale}
                 ontoggle={toggleModal}
                 class:qc-desktop={!mobileFlag}
                 onclick={e => {
                     if (e.clickIntoPanel) return;
                     closeModale();
                 }}
            >
            <div class="qc-container">
                {@render tooltipPanelSnippet("modal")}
            </div>
         </dialog>
         {/if}
     </div>
    {/if}
</div>

{#snippet tooltipPanelSnippet(displayMode)}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions,a11y_click_events_have_key_events -->
    <div role="tooltip"
         class="qc-tooltip-panel"
         onclick={e => e.clickIntoPanel = true}
         class:qc-tooltip-visible={visiblePopover}
         class:qc-shading-2={displayMode === "popover"}
         bind:this={tooltipPanel}
         style:--translateY={translateY}
         style:--translateX={translateX}
         id={tooltipId}
    >
        <div class="qc-tooltip-content">
            <div class="qc-tooltip-content-text">
            {@html description}{@render descriptionSlot()}
            </div>
        </div>
        <a role="button"
           class="qc-tooltip-xclose"
           href="#top"
           aria-label={labels.closeButton.ariaLabel}
           onclick={e => {
               e.preventDefault();
               closeTooltip();
           }}
           onkeydown={e => {
                 if (e.code === "Space") {
                     e.preventDefault();
                     closeTooltip(e);
                 }
             }}
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
        font-size: var(--qc-font-size-md);
        font-family: var(--qc-font-family-content);
        font-weight: var(--qc-font-weight-regular);
        --pin-gap: 4px;
        --pin-height: 9px;
        --pin-base: 15px;
    }
    .clickable-gutter {
        position: absolute;
        height: 24px;
        width: 24px;
        left: -4px;
        top: -4px;
        cursor: pointer;
    }
    .qc-tooltip-text {
        border-bottom: 1px dashed var(--qc-color-blue-piv);
        cursor: pointer;
        white-space: nowrap;
        margin-right: calc( .5 * var(--qc-spacer-xs) );
    }
    .qc-tooltip-button {
        align-self: center;
        height: 16px;
        width: 16px;
        line-height: 16px;
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
        max-height: calc(var(--max-height) - 48px);
        scrollbar-gutter: stable;
        padding-right: 16px;
        padding-top: 3px;
        padding-left: 3px;
    }

    .qc-tooltip-content-text {
        max-inline-size: var(--qc-max-content-width);
    }

    .qc-tooltip-content:focus-visible {
        outline: none;
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

        &.qc-desktop {
            padding-top: 8px;
        }

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
        font-size: var(--qc-font-size-sm);
        line-height: var(--qc-line-height-sm);
        position: relative;
        min-height: 68px;
        max-height: var(--max-height);
        background: var(--qc-color-background);
        color: var(--qc-color-text-primary);
        width: 100%;
        padding-top: 21px;
        padding-left: 13px;
        padding-bottom: 24px;
    }

    .qc-tooltip-popover {

        .qc-tooltip-panel {
            visibility: hidden;
            position: absolute;
            min-width: 216px;
            max-width: 320px;
            padding-right: 8px;
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

        &.qc-tooltip-top .qc-tooltip-pin,
        &.qc-tooltip-bottom .qc-tooltip-pin
        {
            left: calc(.5 * var(--pin-height) - 1px);
        }
        &.qc-tooltip-top .qc-tooltip-pin {
            top: calc(-100% - var(--pin-gap) + 2px);
            transform: rotate(-90deg);
        }

        &.qc-tooltip-bottom .qc-tooltip-pin {
            top: calc(100% + var(--pin-gap) - 1px);
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

        .qc-tooltip-content:focus-visible {
            outline: 2px solid var(--qc-color-blue-regular);
            outline-offset: 1px;
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