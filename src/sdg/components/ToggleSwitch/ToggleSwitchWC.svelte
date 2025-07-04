<svelte:options customElement = {{
    tag: 'qc-toggle-switch',
    shadow: 'none',
    props: {
        label: {attribute: 'label', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        justify: {attribute: 'justify', type: 'Boolean'},
    },
}} />

<script>
    import ToggleSwitch from "./ToggleSwitch.svelte";

    let {
        checked = $bindable(false),
        disabled = $bindable(false),
        ...rest
    } = $props();
</script>

<ToggleSwitch
    {checked}
    {disabled}
    {...rest}
/>
