<svelte:options customElement = {{
    tag: 'qc-toggle-switch',
    shadow: 'none',
    props: {
        switchId: {attribute: 'switch-id', type: 'String'},
        name: {attribute: 'name', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
    },
}} />

<script>
    import ToggleSwitch from "./ToggleSwitch.svelte";

    let {
        switchId,
        name,
        checked = $bindable(false),
        ...rest
    } = $props();
</script>

<ToggleSwitch
    {switchId}
    {name}
    {checked}
    {...rest}
/>
