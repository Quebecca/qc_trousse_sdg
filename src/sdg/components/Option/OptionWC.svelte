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
    let observer;

    onMount(() => {
        parent = $host().closest("qc-dropdown-list");
        if (parent) {
            parent.addOption(label ?? $host().innerHTML, value, disabled, selected);
        }

        index = parent.items.length - 1;

        setupObserver();
    });
    onDestroy(() => {
        if (parent) {
            parent.items.splice(index, 1);
        }

        observer?.disconnect();
    });
    $effect(() => {
        if (parent) {
            selected = parent.items[index].checked;
        }
    });

    function setupObserver() {
        if (parent) {
            observer?.disconnect();
            observer = new MutationObserver(() => {
                parent.updateOption(index, label ?? $host().innerHTML, value, disabled, selected);
                $host().dispatchEvent(new Event("change"));
            });
            observer.observe($host(), {
                childList: true,
                subtree: true,
                characterData: true,
                attributes: true,
                attributeFilter: ["label", "value", "disabled", "selected"]
            });
        }
    }
</script>

<div hidden>
    <slot />
</div>