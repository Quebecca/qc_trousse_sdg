<script>
    import IconButton from '../IconButton/IconButton.svelte'
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    let {
        text,
        description,
        placement
    } = $props()
    let src = Utils.imagesRelativePath + "info-tooltip.svg";
</script>
<span class="qc-tooltip qc-tooltip-{placement}"

    >
 {#if text}
     <span class="qc-tooltip-text">{@html text}</span>
 {/if}
 {#if text}
     <div class="qc-tooltip-container">
         <a role="button"
            class="qc-tooltip-button"
            href="#top"
            onclick={e => e.preventDefault()}
         >
            <Icon type="info-tooltip" size="sm" />
        </a>

             <div class="qc-tooltip-pin"><svg

                     width="9"
                     height="15"
                     viewBox="0 0 9 15"
                     fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                <path d="M8.02002 14.1667L1.35335 7.50004L8.02002 0.833374L8.02002 14.1667Z" fill="white"/>
                <path d="M1.35335 7.5L8.02002 14.1667L8.02002 15H7.02002V14.5118L1.90735e-05 7.5L7.02002 0.488157V0L8.02002 3.64262e-08L8.02002 0.833335L1.35335 7.5Z"
                      fill="#C5CAD2"/>
             </svg></div>

         <div class="qc-tooltip-panel  qc-shading-1">
             <div class="qc-tooltip-content">
                {@html description}
             </div>
            <a role="button"
               class="qc-tooltip-xclose"
               href="#top"
               onclick={e => e.preventDefault()}
            >
                <Icon type="xclose"
                      color="blue-piv"
                      size="sm" />
            </a>
         </div>
     </div>

 {/if}
</span>


<style>
    .qc-tooltip {
        display: inline-flex;
        align-items: baseline;
        --max-height : 160px;
        --pin-gap: 4px;
        --pin-height: 9px;
        --pin-base: 15px;
    }
    .qc-tooltip-text {
        border-bottom: 1px dashed var(--qc-color-text-primary);
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

    .qc-tooltip-panel {
        position: absolute;
        top: -16px;
        left: calc(100% + var(--pin-gap) + var(--pin-height) - 1px);
        min-width: 216px;
        max-width: 320px;
        width: max-content;
        min-height: 68px;
        max-height: var(--max-height);
        background: var(--qc-color-background);
        border: 1px solid var(--qc-color-grey-light);
        z-index:199;
        padding: 24px 8px 24px 16px;
    }

    .qc-tooltip-bottom .qc-tooltip-pin {
        top: calc(100% - 1px);
        left: calc(var(--pin-height) - 1px);
        transform: rotate(90deg);
    }

    .qc-tooltip-bottom .qc-tooltip-panel {
        top: calc(100% + var(--pin-height));
        left:auto;
        right: -16px;
    }

    .qc-tooltip-top .qc-tooltip-pin {
        top: calc(-100% + 4px - var(--pin-gap));
        left: calc(var(--pin-height) - 1px);
        transform: rotate(-90deg);
    }

    .qc-tooltip-top .qc-tooltip-panel {
        /*display: none;*/
        top: 0;
        transform: translateY( calc(-100% - var(--pin-gap) - var(--pin-height) + 2px));
        left:auto;
        right: -16px;
    }

    .qc-tooltip-content {
        /*font-size: var(--qc-font-size-90);*/
        /*line-height: var(--qc-line-height-90);*/
        overflow-y: auto;
        max-height:calc(var(--max-height) - 48px);
        scrollbar-gutter: stable;
        padding-right:16px;
    }

    .qc-tooltip-xclose {
        position: absolute;
        right: 8px;
        top: 8px;
        line-height: 16px;
        height: 16px;
    }

    ::-webkit-scrollbar,
    ::-webkit-scrollbar-track,
    ::-webkit-scrollbar-thumb
    {
        background: transparent;
        border: none;
        border-radius: 4px;
        height: 50%;
        width: 8px;
        margin-top: 8px;
        margin-right: -8px;
    }
    ::-webkit-scrollbar-thumb {
        background: var(--qc-color-blue-piv);
    }

    ::-webkit-scrollbar-button,
    ::-webkit-scrollbar-track-piece,
    ::-webkit-scrollbar-corner,
    ::-webkit-resizer {
        display: none;
    }



    @supports not selector(::-webkit-scrollbar) {
        scrollbar-color:  var(--qc-color-blue-piv) transparent;
        scrollbar-width: thin;
    }

</style>