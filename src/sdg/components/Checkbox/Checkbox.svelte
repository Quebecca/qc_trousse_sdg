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
</script>

<div class={`${hasParentGroup ? "" : " checkbox-single"}${Utils.isTruthy(invalid) ? " checkbox-single-invalid" : ""}`}>
    <div class={`checkbox-${size}`}>
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
</div>
