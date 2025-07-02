<svelte:options customElement="{{
    tag: 'qc-dropdown-list',
    shadow: 'none',
    props: {
        id: {attribute: 'id', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        items: {attribute: 'items', type:'Object'},
        label: {attribute: 'label', type: 'String'},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        comboAriaLabel: {attribute: 'combo-aria-label', type: 'String'},
        ariaRequired: {attribute: 'combo-aria-required', type: 'Boolean'},
        error: {attribute: 'error', type: 'Boolean'},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        emptyOptionSrMessage: {attribute: 'empty-option-sr-message', type: 'String'},
        isMultiSelect: {attribute: 'is-multi-select', type: 'Boolean'},
        cssPath: {attribute: 'css-path'}
    }
}}"/>
<script>
    import DropdownList from "./DropdownList.svelte";

    /** @type {Props & { [key: string]: any }} */
    let { ...rest } = $props();
</script>
<DropdownList {...rest} />
