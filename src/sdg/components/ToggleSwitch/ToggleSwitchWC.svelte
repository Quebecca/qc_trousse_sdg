<svelte:options customElement = {{
    tag: 'qc-toggle-switch',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        handleOnChange: {attribute: 'handle-on-change', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
    },
}} />

<script>
    import ToggleSwitch from "./ToggleSwitch.svelte";

    let {
        name,
        handleOnChange,
        checked = $bindable(false),
        ...rest
    } = $props();
</script>

<ToggleSwitch
    {name}
    {handleOnChange}
    {checked}
    {...rest}
/>
