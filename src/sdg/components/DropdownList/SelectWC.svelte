<svelte:options customElement="{{
    tag: 'qc-select',
    props: {
        id: {attribute: 'id', type: 'String'},
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
    import {onDestroy, onMount} from "svelte";
    import DropdownList from "./DropdownList.svelte";

    let {
        invalid = $bindable(false),
        value = $bindable(),
        multiple,
        ...rest
    } = $props();

    let selectElement = $state();
    let items = $state();
    let label = $state();
    let observer;

    onMount(() => {
        selectElement = $host().querySelector("select");
        label = $host().querySelector("label");
        setupItemsList();
        setupObserver();
    });

    onDestroy(() => {
        observer?.disconnect();
    })

    $effect(() => {
        if (selectElement) {
            setupObserver();
        }
    })

    $effect(() => {
        const valueArray = value?.split(", ") ?? [];

        if (selectElement && selectElement.options && selectElement.options.length > 0) {
            for (const option of selectElement.options) {
                if (valueArray.includes(option.value)) {
                    option.setAttribute('selected', '');
                    option.selected = true;
                } else {
                    option.removeAttribute('selected');
                    option.selected = false;
                }
            }
        }
    });

    function setupItemsList() {
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

    function setupObserver() {
        if (selectElement) {
            observer?.disconnect();
            observer = new MutationObserver(setupItemsList);
            observer.observe(selectElement, {
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

<DropdownList label={label?.innerHTML} {items} bind:value {invalid} {multiple} {...rest} />

