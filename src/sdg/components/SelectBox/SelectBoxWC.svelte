<svelte:options customElement="{{
    tag: 'qc-select-box',
    shadow: 'none',
    props: {
        id: {attribute: 'id'},
        value: {attribute: 'value'},
        items: {attribute: 'items', type:'Object'},
        label: {attribute: 'label'},
        enableSearch: {attribute: 'enable-search'},
        comboAriaLabel: {attribute: 'combo-aria-label'},
        ariaRequired: {attribute: 'combo-aria-required'},
        error: {attribute: 'error'},
        searchPlaceholder: {attribute: 'search-placeholder'},
        emptyOptionSrMessage: {attribute: 'empty-option-sr-message'},
        isMultiSelect: {attribute: 'is-multi-select'},
        cssPath: {attribute: 'css-path'}
    }
}}"/>
<script>
import SelectBox from "./SelectBox.svelte";
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
<SelectBox
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
