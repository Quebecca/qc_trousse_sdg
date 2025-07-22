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
    import {onMount, onDestroy} from "svelte";

    let {
        id,
        label,
        checked = $bindable(false),
        disabled = false,
        ...rest
    } = $props();

    let parent = $state();
    let index;
    onMount(() => {
        parent = $host().closest("qc-toggle-switch-group");

        if (parent) {
            // $host().setAttribute("id", id + "-custom-element");
            parent.items.push({
                id,
                label,
                disabled,
                checked
            });
            index = parent.items.length - 1;
            // parent.removeChild($host());
        }
    });
    onDestroy(() => {
        parent.items.splice(index, 1);
    })
    $effect(() => {
        if (parent) {
            checked = parent.items[index].checked;
            $host().dispatchEvent(new Event("change"));
        }
    })
    $inspect("ToggleSwitch wc ", checked)
</script>

{#if !parent}
    <ToggleSwitch
        {label}
        bind:checked
        {disabled}
        {...rest}
    />
{/if}

