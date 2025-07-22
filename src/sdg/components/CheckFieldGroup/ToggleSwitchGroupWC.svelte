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
    import {onMount} from "svelte";

    let {
        disabled = $bindable(false),
        labelPosition = "left",
        ...rest
    } = $props();


    let items = $state(
        []
    );

    export function addItem(id, label, checked, disabled) {
        // clearCustomElements();

        items.push({
            id: id ?? undefined,
            label: label,
            checked: checked,
            disabled: disabled
        });
    }
</script>

<CheckFieldGroup
    elementsGap="md"
    justifyEnd={labelPosition !== "right"}
    {...rest}
>
    {#each items as item}
        <ToggleSwitch
            id={item.id}
            label={item.label}
            checked={item.checked}
            disabled={item.disabled ?? disabled}
            {labelPosition}
        />
    {/each}
</CheckFieldGroup>

