<svelte:options customElement={{
    tag: 'qc-toggle-switch-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        labelPosition: {attribute:'label-position', type: 'String'},
    }
}} />

<script>
    import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";

    let {
        disabled = $bindable(false),
        labelPosition = "left",
        ...rest
    } = $props();

    const formFieldElements = Array.from($host().querySelectorAll("qc-toggle-switch"));
    formFieldElements.forEach(element => {
        $host().removeChild(element);
    });
    const items = formFieldElements.map(element => {
        return {
            value: element.value,
            label: element.label,
            checked: element.checked,
            disabled: element.disabled,
        };
    });
</script>

<CheckFieldGroup
    elementsGap="md"
    justifyEnd={labelPosition !== "right"}
    {...rest}
>
    {#each items as item}
        <ToggleSwitch
            label={item.label}
            value={item.value}
            disabled={item.disabled ?? disabled}
            {labelPosition}
        />
    {/each}
</CheckFieldGroup>

