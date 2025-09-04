<script>
    import FormError from '../FormError/FormError.svelte';
    import { onMount } from 'svelte';
    import {Utils} from "../utils";
    import LabelText from "../Label/LabelText.svelte";

    let {
        legend,
        name,
        selectionButton = false,
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
        rootElement = $bindable(),
    } = $props();

    let groupSelection = $state(),
        legendId = name
            ? "id_" + name
            : Utils.generateId("legend");
</script>
{#snippet fieldset()}
<fieldset bind:this={rootElement}
            class={[
            "qc-choice-group",
            "qc-fieldset",
            compact && "qc-compact",
            disabled && "qc-disabled"]}
          aria-describedby={legendId}
          {onchange}
          selection-button={selectionButton ? selectionButton : undefined}
          inline={inline ? inline : undefined}
>
  {#if legend}
    <legend id={legendId}>
        <LabelText text={legend} {required} />
    </legend>
  {/if}
    <div
        class={[
            selectionButton && !inline && "qc-field-elements-selection-button",
            selectionButton && inline && "qc-field-elements-selection-button-flex-row",
            !selectionButton && "qc-field-elements-flex",
            !selectionButton && `qc-field-elements-flex-${elementsGap}`,
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
{/snippet}

{#if !invalid}
    {@render fieldset()}
{:else}
    <div class="qc-fieldset-invalid">
        {@render fieldset()}
    </div>
{/if}