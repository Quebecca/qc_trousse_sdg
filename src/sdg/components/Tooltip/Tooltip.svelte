<script>
    import IconButton from '../IconButton/IconButton.svelte'
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    let {
        text,
        description
    } = $props()
    let src = Utils.imagesRelativePath + "info-tooltip.svg";
</script>
{text} {description}
<span class="qc-tooltip">
 {#if text}
     <span class="qc-tooltip-text">{@html text}</span>
 {/if}
 {#if text}
     <a role="button"
        class="qc-tooltip-button"
        href="#top"
        onclick={e => e.preventDefault()}
        ><Icon type="info-tooltip" size="sm" />
     </a>
 {/if}
</span>


<style>
    .qc-tooltip {
        display: inline-flex;
        align-items: baseline;
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
</style>