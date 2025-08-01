<svelte:options customElement="{{
    tag: 'qc-option',
    props: {
        label: {attribute: 'label', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        disabled: {attribute: 'disabled', type: 'Boolean', reflect: true},
        selected: {attribute: 'selected', type: 'Boolean', reflect: true},
    }
}}"/>

<script>
    import {onDestroy, onMount} from "svelte";

    let { label, value, disabled, selected } = $props();
    let index;
    let parent = $state();

    onMount(() => {
        parent = $host().closest("qc-dropdown-list");
        if (parent) {
            parent.addOption(label ?? $host().innerHTML, value, disabled, selected);
        }

        index = parent.items.length - 1;
    });
    onDestroy(() => {
        if (parent) {
            parent.items.splice(index, 1);
        }
    });
    $effect(() => {
        if (parent) {
            selected = parent.items[index].checked;
            $host().dispatchEvent(new Event("change"));
        }
    });
</script>

<div hidden>
    <slot />
</div>