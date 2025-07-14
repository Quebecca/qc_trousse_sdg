<svelte:options customElement="{{
    tag: 'qc-dropdown-list',
    shadow: 'none',
    props: {
        id: {attribute: 'id', type: 'String'},
        label: {attribute: 'label', type: 'String'},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        comboAriaLabel: {attribute: 'combo-aria-label', type: 'String'},
        ariaRequired: {attribute: 'combo-aria-required', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean', reflect: true},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        emptyOptionSrMessage: {attribute: 'empty-option-sr-message', type: 'String'},
        multiple: {attribute: 'multiple', type: 'Boolean'},
    }
}}"/>

<script>
    import {onMount} from "svelte";
    import DropdownList from "./DropdownList.svelte";

    let {
        invalid = $bindable(false),
        ...rest
    } = $props();

    let items = $state([]);
    onMount(() => {
        const optionsValues = [];

        Array.from($host().querySelectorAll("option"))
            .forEach(node => {
            $host().removeChild(node);

            optionsValues.push({
                label: node.innerHTML,
                value: node.value,
                disabled: node.disabled,
                checked: false
            });
        });

        items = optionsValues;
    });
</script>

<DropdownList {items} {invalid} {...rest} />
