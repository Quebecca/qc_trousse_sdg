<svelte:options customElement = {{
    tag: 'qc-toggle-switch',
    shadow: 'none',
    props: {
        id: {attribute: 'id', type: 'String'},
        label: {attribute: 'label', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean', reflect: true},
        disabled: {attribute: 'disabled', type: 'Boolean', reflect: true},
        labelPosition: {attribute: 'label-position', type: 'String'},
    }
}} />

<script>
    import ToggleSwitch from "./ToggleSwitch.svelte";
    import {onMount} from "svelte";

    let {
        id,
        label,
        checked = false,
        disabled = false,
        ...rest
    } = $props();

    let parent = $state();
    onMount(() => {
        parent = $host().closest("qc-toggle-switch-group");

        if (parent) {
            // $host().setAttribute("id", id + "-custom-element");
            parent.addItem(id, label, checked, disabled);
            parent.removeChild($host());
        }
    });
</script>

{#if !parent}
    <ToggleSwitch
        {label}
        bind:checked
        {disabled}
        {...rest}
    />
{/if}

