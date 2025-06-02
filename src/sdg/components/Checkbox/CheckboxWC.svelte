
<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        checkboxName: { attribute: 'checkbox-name' },
        checkboxLabel: { attribute: 'checkbox-label' },
        checkboxValue: { attribute: 'checkbox-value' },
        checkboxSize: { attribute: 'checkbox-size' },
        checkboxChecked: { attribute: 'checkbox-checked', type: "Boolean" },
        checkboxDisabled: { attribute: 'checkbox-disabled', type: "Boolean" },
        checkboxRequired: { attribute: 'checkbox-required', type: "Boolean" },
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    let props = $props();
</script>

<Checkbox {...props} />