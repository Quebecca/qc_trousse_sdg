<svelte:options customElement="{{
    tag: 'qc-dropdown-list',
    shadow: 'none',
    props: {
        id: {attribute: 'id', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        label: {attribute: 'label', type: 'String'},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        comboAriaLabel: {attribute: 'combo-aria-label', type: 'String'},
        ariaRequired: {attribute: 'combo-aria-required', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean'},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        emptyOptionSrMessage: {attribute: 'empty-option-sr-message', type: 'String'},
        isMultiSelect: {attribute: 'multiple', type: 'Boolean'},
    }
}}"/>
<script>
    import DropdownList from "./DropdownList.svelte";
    import {onMount} from "svelte";

    let { ...rest } = $props();

    let items = $state([]);
    onMount(() => {
        const optionsValues = [];

        $host().childNodes.forEach(node => {
            optionsValues.push(node.value);
        });

        items = optionsValues;
    });
</script>
<DropdownList {items} {...rest} />
