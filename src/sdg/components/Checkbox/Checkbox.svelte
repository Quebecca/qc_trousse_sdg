<script>
    import { Utils } from "../utils";
    import Icon from "../Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();

    let {
        value,
        label,
        name,
        disabled = false,
        checked = false,
        required = false,
        size = "md",
        invalid = false,
        errorText = lang === "fr" ? "Champ obligatoire" : "Required field"
    } = $props();
    
    let id = $derived(name + "_" + value);
    let inputInstance;

    // function removeInvalid() {
    //     invalid = false;
    //     inputInstance.dispatchEvent(
    //         new CustomEvent(
    //             `qc.checkbox.removeInvalidFor${name}`,
    //             {bubbles: true, composed: true}
    //         )
    //     );
    // }

    // function handleInvalid(event) {
    //     if (required && !checked) {
    //         event.preventDefault();
    //         invalid = true;
    //     }
    // }
</script>

<div class={`checkbox-container${Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}`}>
    <div class="checkbox-{size}">
        <input
            type="checkbox"
            value={value}
            {name}
            {id}
            {disabled}
            {checked}
            {required}
            bind:this={inputInstance}
        />
        <label for={id}>
            {label}
            {#if required}
                <span class="required">*</span>
            {/if}
        </label>
    </div>

    <div class={`qc-checkbox-invalid${Utils.isTruthy(invalid) ? "" : "-hidden"}`} role="alert">
        <Icon
            type="warning"
            color="red-regular"
            size="md"
        />
        <p>{errorText}</p>
    </div>
</div>

<style>
    .required {
        color: var(--qc-color-red-regular);
        margin-left: 0.25rem;
    }

    .checkbox-container {
        display: flex;
        flex-direction: column;
        gap: var(--qc-spacer-sm);
    }
</style>