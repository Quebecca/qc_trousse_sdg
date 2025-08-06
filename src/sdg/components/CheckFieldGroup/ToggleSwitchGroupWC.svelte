<svelte:options customElement={{
    tag: 'qc-toggle-switch-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        justified: {attribute:'justified', type: 'Boolean'},
    }
}} />

<script>
    import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";

    let {
        disabled = $bindable(false),
        items = $bindable([]),
        justified = false,
        ...rest
    } = $props();
</script>

<CheckFieldGroup
    elementsGap="md"
    {...rest}
>
    {#each items as item}
        <ToggleSwitch
            id={item.id}
            label={item.label}
            bind:checked={item.checked}
            disabled={item.disabled ?? disabled}
            justified={justified ?? item.justified}
        />
    {/each}
</CheckFieldGroup>

