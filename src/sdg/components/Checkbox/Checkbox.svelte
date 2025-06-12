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
        invalidText = lang === "fr" ? "Champ obligatoire" : "Required field",
        hasParentGroup = false
    } = $props();
    
    let id = $derived(name + "_" + value);

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

    console.log(hasParentGroup)
</script>

<div class={`checkbox-container${Utils.isTruthy(invalid) ? " qc-fieldset-invalid" : ""}`}>
    <div class="checkbox-{size}">
        <input
            type="checkbox"
            {value}
            {name}
            {id}
            {disabled}
            {checked}
            aria-required = {required}
            aria-invalid={invalid}
        />
        <label for={id}>
            {label}
            {#if !hasParentGroup && required}
                <span class="qc-checkbox-required">*</span>
            {/if}
        </label>
    </div>

    <div class={`qc-checkbox-invalid${Utils.isTruthy(invalid) ? " qc-checkbox-invalid-visible" : ""}`} role="alert">
        {#if !hasParentGroup && Utils.isTruthy(invalid)}
            <Icon
                type="warning"
                color="red-regular"
                size="md"
            />
            <span>{invalidText}</span>
        {/if}
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