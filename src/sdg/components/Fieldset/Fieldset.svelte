<script>
    import FormError from '../FormError/FormError.svelte';
    import { onMount } from 'svelte';
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
    let {
        legend,
        name,
        compact,
        required = false,
        disabled,
        invalid = $bindable(false),
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        children,
        updateValue = () => {},
        formFieldElements
    } = $props();
    let legendElement,
        legendId = name
            ? "id_" + name
            : "legend-" + Math.floor(Math.random() * 1000000 );
    onMount(() => {
        legendElement.after(...formFieldElements);
    });
</script>
<fieldset class={[
            invalid && "qc-fieldset-invalid",
            "qc-fieldset",
            compact && "qc-compact",
            disabled && "qc-disabled"]}
          aria-describedby={legendId}
          onchange={updateValue}
    >
    <legend id={legendId}
            bind:this={legendElement}
    >
        {@html legend}
        {#if required}
            <span class="qc-required" aria-hidden="true">*</span>
        {/if}
    </legend>
    {@render children?.()}
    <FormError {invalid} {invalidText} />

</fieldset>