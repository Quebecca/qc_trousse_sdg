<svelte:options customElement={{
    tag: 'qc-toggle-switch-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        justified: {attribute:'justified', type: 'Boolean'},
        textAlign: {attribute:'text-align', type: 'String'},
        maxWidth: {attribute:'max-width', type: 'String'},
    }
}} />

<script>
    import ToggleSwitch from "../ToggleSwitch/ToggleSwitch.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";

    let {
        disabled = $bindable(false),
        items = $bindable([]),
        justified = false,
        textAlign,
        maxWidth = "fit-content",
        ...rest
    } = $props();

    let usedWidth = $derived.by(() => {
        if (
            maxWidth.match(/^\d+px$/)
            || maxWidth.match(/^\d+rem$/)
            || maxWidth.match(/^\d+em$/)
            || maxWidth.match(/^\d+%$/)
            || maxWidth === "100%"
        ) {
            return maxWidth;
        } else {
            return "fit-content";
        }
    });
</script>

<CheckFieldGroup
    elementsGap="md"
    maxWidth={usedWidth}
    {...rest}
>
    {#each items as item}
        <ToggleSwitch
            id={item.id}
            label={item.label}
            bind:checked={item.checked}
            disabled={item.disabled ?? disabled}
            justified={justified ?? item.justified}
            textAlign={textAlign ?? item.textAlign}
        />
    {/each}
</CheckFieldGroup>

