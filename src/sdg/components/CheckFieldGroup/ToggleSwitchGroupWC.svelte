<svelte:options customElement={{
    tag: 'qc-toggle-switch-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        justified: {attribute:'justified', type: 'Boolean'},
        textAlign: {attribute:'text-align', type: 'String'},
    }
}} />

<script>
    import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";

    let {
        disabled = $bindable(false),
        items = $bindable([]),
        justified = false,
        textAlign = 'left',
        ...rest
    } = $props();

    const usedLabelTextAlignment = textAlign?.toLowerCase() === "end" ? "end" : "start";
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
            textAlign={item.textAlign ?? usedLabelTextAlignment}
        />
    {/each}
</CheckFieldGroup>

