<svelte:options customElement="{{
    tag: 'qc-select',
    props: {
        id: {attribute: 'id', type: 'String'},
        label: {attribute: 'label', type: 'String'},
        width: {attribute: 'width', type: 'String'},
        value: {attribute: 'value', type: 'String', reflect: true},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean', reflect: true},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        placeholder: {attribute: 'placeholder', type: 'String'},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        noOptionsMessage: {attribute: 'no-options-message', type: 'String'},
        multiple: {attribute: 'multiple', type: 'Boolean'}
    }
}}"/>

<script>
    import {onMount} from "svelte";
    import DropdownList from "./DropdownList.svelte";

    let {
        invalid = $bindable(false),
        value = $bindable(),
        multiple,
        ...rest
    } = $props();

    let selectElement = $state();
    let items = $state();
    onMount(() => {
        selectElement = $host().querySelector("select");
    });

    $effect(() => {
        if (selectElement) {
            const options = selectElement?.querySelectorAll("option");
            if (options && options.length > 0) {
                items = Array.from(options).map(option => ({
                    value: option.value,
                    label: option.label ?? option.innerHTML,
                    checked: option.selected,
                    disabled: option.disabled,
                }));
            } else {
                items = [];
            }
        }
    })

    $effect(() => {
        if (multiple) {
            const valueArray = value?.split(", ") ?? [];
            if (selectElement.options.length !== valueArray.length) {
                for (const option of selectElement.options) {
                    option.selected = valueArray.includes(option.value);
                }
            }
        } else {
            selectElement.value = value;
        }
    });
</script>

<div hidden>
    <slot />
</div>

{#if items && items.length > 0}
    <DropdownList {items} bind:value {invalid} {multiple} {...rest} />
{/if}
