<svelte:options customElement="{{
    tag: 'qc-dropdown-list',
    shadow: 'none',
    props: {
        id: {attribute: 'id', type: 'String'},
        legend: {attribute: 'legend', type: 'String'},
        value: {attribute: 'value', type: 'String', reflect: true},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        comboAriaLabel: {attribute: 'combo-aria-label', type: 'String'},
        required: {attribute: 'required', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean', reflect: true},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        emptyOptionSrMessage: {attribute: 'empty-option-sr-message', type: 'String'},
        multiple: {attribute: 'multiple', type: 'Boolean'},
    }
}}"/>

<script>
    import DropdownList from "./DropdownList.svelte";

    let {
        invalid = $bindable(false),
        value = $bindable(),
        ...rest
    } = $props();

    let items = $state(
        Array.from($host().querySelectorAll("qc-option"))
            .map(node => ({
                label: node.label ?? node.innerHTML,
                value: node.value,
                disabled: node.disabled,
                checked: node.selected ?? false,
            }))
    );
</script>

<DropdownList {items} {invalid} bind:value {...rest} />
