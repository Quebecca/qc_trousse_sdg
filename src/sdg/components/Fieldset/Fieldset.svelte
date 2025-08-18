<script>
    import FormError from '../FormError/FormError.svelte';
    import { onMount } from 'svelte';
    import {Utils} from "../utils";

    let {
        legend,
        name,
        tiled = false,
        inline = false,
        columnCount = 1,
        compact,
        required = false,
        disabled,
        invalid = $bindable(false),
        invalidText,
        onchange = () => {},
        elementsGap = "sm",
        maxWidth = "fit-content",
        children,
        slotContent
    } = $props();

    let groupSelection = $state(),
        legendId = name
            ? "id_" + name
            : Utils.generateId("legend");

    function chooseDivCLass(inline, tiled) {
        if (tiled) {
            if (inline) {
                return "qc-field-elements-tiled-flex-row";
            } else {
                return "qc-field-elements-tiled";
            }
        }
        return "qc-field-elements-flex";
    }
</script>

<fieldset class={[
            invalid && "qc-fieldset-invalid",
            "qc-fieldset",
            compact && "qc-compact",
            disabled && "qc-disabled"]}
          aria-describedby={legendId}
          {onchange}
>
  {#if legend}
    <legend id={legendId}>
        {@html legend}
        {#if required}
            <span class="qc-required" aria-hidden="true">*</span>
        {/if}
    </legend>
  {/if}
    <div
        class={[
            chooseDivCLass(inline, tiled),
            !tiled && `qc-field-elements-flex-${elementsGap}`,
        ]}
        style="
        --column-count: {columnCount};
        --fieldset-width: {maxWidth};
        "
        bind:this={groupSelection}
    >
        {@render children?.()}
    </div>
    <FormError {invalid} {invalidText} label={legend} />

</fieldset>
