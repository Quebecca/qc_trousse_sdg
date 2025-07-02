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
    import Select from "./Select.svelte";
    import DropdownList from "./DropdownList.svelte";
    export let
        id = Math.floor(Math.random() * 1000),
        label = '',
        value,
        items,
        noValueMessage = '',
        noOptionsMessage = ' Aucune option disponible',
        enableSearch = true,
        comboAriaLabel = '',
        ariaRequired = false,
        error = '',
        searchPlaceholder = '',
        emptyOptionSrMessage = '',
        isMultiSelect = false,
        cssPath = "/assets/pgu_web_components/Css/ComboSelectBox.css"
    ;
</script>
<DropdownList
        {id}
        {label}
        {value}
        {items}
        {noValueMessage}
        {noOptionsMessage}
        {enableSearch}
        {comboAriaLabel}
        {ariaRequired}
        {error}
        {searchPlaceholder}
        {emptyOptionSrMessage}
        {isMultiSelect}
        {cssPath}
        {...$$restProps}
/>
