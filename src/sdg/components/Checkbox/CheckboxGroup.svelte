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

        // const form = pseudo.closest('form');
        // if (form) {
        //     form.addEventListener('submit', (event) => {
        //         if (required) {
        //             const checkedBoxes = Array.from(document.getElementsByName(name)).filter(cb => cb.checked);
        //             if (checkedBoxes.length === 0) {
        //                 event.preventDefault();
        //                 invalid = true;
        //             } else {
        //                 invalid = false;
        //             }
        //         }
        //     });
        // }
    });
</script>

<div class={Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}>
    <fieldset class="qc-radio-fieldset" aria-describedby={name}>
        <legend class="qc-radio-legend" id={`id_${name}`}>
            {legend}
            {#if Utils.isTruthy(required)}
                <span class="qc-radio-required" aria-hidden="true">*</span>
            {/if}
        </legend>
        <div class="qc-radio-options-{size}" bind:this={checkboxes} onchange={() => invalid = false}></div>

        <div class={`qc-radio-invalid${Utils.isTruthy(invalid) ? " qc-radio-invalid-visible" : ""}`} role="alert">
            {#if Utils.isTruthy(invalid)}
                <div class="qc-radio-invalid-icon">
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
