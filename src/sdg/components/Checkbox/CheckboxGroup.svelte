<script>
    import { setContext, onMount } from 'svelte';
    import { Utils } from "../utils";
    import Icon from "../Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();

    let {
        inners,
        legend,
        name,
        size = "md",
        required = false,
        invalid = false,
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field"
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

<div class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}>
    <fieldset class="qc-checkbox-fieldset" aria-describedby={`id_${name}`}>
        <legend class="qc-checkbox-legend" id={`id_${name}`}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-checkbox-required" aria-hidden="true">*</span>
            {/if}
        </legend>
        <div class="qc-checkbox-group-{size}" bind:this={checkboxes} onchange={() => invalid = false}></div>

        <div class={`qc-checkbox-invalid${Utils.isTruthy(invalid) ? " qc-checkbox-invalid-visible" : ""}`} role="alert">
            {#if Utils.isTruthy(invalid)}
                <div class="qc-checkbox-invalid-icon">
                    <Icon
                        type="warning"
                        color="red-regular"
                        size="md"
                    />
                </div>
                <span>{invalidText}</span>
            {/if}
        </div>
    </fieldset>
</div>
