
<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        checkboxName: { attribute: 'checkbox-name' },
        checkboxValue: { attribute: 'checkbox-value' },
        checkboxSize: { attribute: 'checkbox-size' },
        checkboxChecked: { attribute: 'checkbox-checked', type: "Boolean" },
        checkboxDisabled: { attribute: 'checkbox-disabled', type: "Boolean" },
        checkboxLabel: { attribute: 'checkbox-label' }
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    let props = $props();
</script>

<Checkbox {...props} />