<svelte:options customElement = {{
    tag: 'qc-toggle-switch',
    shadow: 'none',
    props: {
        switchId: {attribute: 'switch-id', type: 'String'},
        name: {attribute: 'name', type: 'String'},
        label: {attribute: 'label', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
    },
}} />

<script>
    import ToggleSwitch from "./ToggleSwitch.svelte";

    let {
        checked = $bindable(false),
        ...rest
    } = $props();
</script>

<ToggleSwitch
    {checked}
    {...rest}
/>
