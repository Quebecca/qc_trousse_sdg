<script>
    import { setContext, onMount } from 'svelte';
    import { Utils } from "../utils";
    import Icon from "../Icon/Icon.svelte";
    import FormError from "../FormError/FormError.svelte";

    const lang = Utils.getPageLanguage();

    let {
        inners,
        legend,
        name,
        size = "md",
        required = false,
        invalid = false,
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        tiled = false,
        flowDirection = "column",
        elementsPerRowOrCol = 1,
    } = $props();

    let checkboxes = $state();
    setContext('name', {name});
    setContext('size', {size});

    onMount(() => {
        inners.forEach(
            inner => checkboxes.appendChild(inner)
        );
    });
</script>

<div
    class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}
    style="--elementsPerRowOrCol: {elementsPerRowOrCol};"
>
    <fieldset class="qc-checkbox-fieldset"
              aria-describedby={`id_${name}`}
    >
        <legend class="qc-checkbox-legend" id={`id_${name}`}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-checkbox-required" aria-hidden="true">*</span>
            {/if}
        </legend>
        <div class={
                Utils.isTruthy(tiled) ?
                `qc-radio-group-tiles-${flowDirection}` :
                `qc-checkbox-group-${size}`
            }
             bind:this={checkboxes}
             onchange={() => invalid = false}>
        </div>

        <FormError {invalid} {invalidText} />
    </fieldset>
</div>
