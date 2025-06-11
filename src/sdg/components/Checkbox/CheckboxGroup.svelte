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
        errorText = lang === "fr" ? "Champ obligatoire" : "Required field"
    } = $props();

    let pseudo;
    setContext('name', {name});
    setContext('size', {size});

    onMount(() => {
        inners.forEach(
            inner => pseudo.appendChild(inner)
        );

        document.addEventListener(
            `qc.checkbox.removeInvalidFor${name}`,
            () => {
                invalid = false;
            }
        );
    });
</script>

<div class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}>
    <fieldset class="checkbox-group-{size}">
        <legend class="qc-checkbox-legend">
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-checkbox-required" aria-hidden="true">&nbsp;*</span>

            {/if}
        </legend>
        <div id="pseudo-slot" class="checkbox-group-{size}" bind:this={pseudo}></div>
        
        <div class={`qc-checkbox-invalid${Utils.isTruthy(invalid) ? "" : "-hidden"}`} role="alert">
            <Icon
                type="warning"
                color="red-regular"
                size="md"
            />
            <p>{errorText}</p>
        </div>
    </fieldset>
</div>

<style>
    .qc-checkbox-required {
        color: var(--qc-color-red-regular);
    }
</style>