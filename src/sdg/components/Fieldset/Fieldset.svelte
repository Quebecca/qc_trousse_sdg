<script>
    import FormError from '../FormError/FormError.svelte';
    import { onMount } from 'svelte';
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
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
            class={chooseDivCLass(inline, tiled)}
            style="--column-count: {columnCount}"
            bind:this={groupSelection}
    >
        {@render children?.()}
    </div>
    <FormError {invalid} {invalidText} />

</fieldset>