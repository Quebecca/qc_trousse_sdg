<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        checkboxName: { attribute: 'checkbox-name' },
        label: { attribute: 'label' },
        value: { attribute: 'value' },
        size: { attribute: 'size' },
        checked: { attribute: 'checked', type: "Boolean" },
        disabled: { attribute: 'disabled', type: "Boolean" },
        required: { attribute: 'required', type: "Boolean" },
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    
    let {
        checkboxName = "",
        label = "",
        value = "",
        size = "md",
        checked = false,
        disabled = false,
        required = false
    } = $props();
    
    // Utiliser le label comme value si non spécifié
    let effectiveValue = $derived(value || label);
</script>

<Checkbox
        checkboxName={checkboxName}
        checkboxLabel={label}
        checkboxValue={effectiveValue}
        checkboxSize={size}
        checkboxChecked={checked}
        checkboxDisabled={disabled}
        checkboxRequired={required}
/>