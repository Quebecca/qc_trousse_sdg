<script>
    import FormError from '../FormError/FormError.svelte';
    import { onMount } from 'svelte';
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
    let {
        legend,
        name,
        grid = false,
        flowDirection = "column",
        elementsPerRowOrCol = 1,
        compact,
        required = false,
        disabled,
        invalid = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        updateValue = () => {},
        formFieldElements,
        children
    } = $props();
    let groupSelection = $state(),
        legendId = name
            ? "id_" + name
            : "legend-" + Math.floor(Math.random() * 1000000 );
    onMount(() => {
        groupSelection.append(...formFieldElements);
    });
</script>
<fieldset class={[
            invalid && "qc-fieldset-invalid",
            "qc-fieldset",
            compact && "qc-compact",
            disabled && "qc-fieldset-disabled"]}
          aria-describedby={legendId}
          onchange={updateValue}
    >
    <legend id={legendId}>
        {@html legend}
        {#if required}
            <span class="qc-fieldset-required" aria-hidden="true">*</span>
        {/if}
    </legend>
    <div
        class={grid ? `qc-field-elements-grid-${flowDirection}` : "qc-field-elements-flex"}
        style="--elements-per-row-or-col: {elementsPerRowOrCol}"
        bind:this={groupSelection}
    >
        {@render children?.()}
    </div>
    <FormError {invalid} {invalidText} />

</fieldset>