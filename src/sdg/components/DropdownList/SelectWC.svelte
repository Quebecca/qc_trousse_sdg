<svelte:options customElement="{{
    tag: 'qc-select',
    props: {
        id: {attribute: 'id', type: 'String'},
        label: {attribute: 'label', type: 'String', reflect: true},
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
    import {Utils} from "../utils";

    let {
        invalid = $bindable(false),
        value = $bindable(),
        multiple,
        label,
        ...rest
    } = $props();

    let selectElement = $state();
    let items = $state();
    let labelElement = $state();
    let observer;
    let instance = $state();
    let errorElement = $state();
    let parentRow = $derived($host().closest(".qc-textfield-row"));

    onMount(() => {
        selectElement = $host().querySelector("select");
        labelElement = $host().querySelector("label");
        setupItemsList();
        setupObserver();
    });

    onDestroy(() => {
        observer?.disconnect();
    });

    $effect(() => {
        if (
            selectElement
            && selectElement.options
            && selectElement.options.length > 0
            && value
            && value.length > 0
        ) {
            for (const option of selectElement.options) {
                if (value.includes(option.value)) {
                    option.setAttribute('selected', '');
                    option.selected = true;
                } else {
                    option.removeAttribute('selected');
                    option.selected = false;
                }
            }
        }
    });

    $effect(() => {
        if (labelElement) {
            label = labelElement.innerHTML;
        }
    });

    $effect(() => {
       if (parentRow && errorElement) {
           parentRow.appendChild(errorElement);
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
            if (observer) {
                return;
            }
            observer = new MutationObserver(setupItemsList);
            observer.observe(selectElement, {
                childList: true,
                attributes: true,
                attributeFilter: ["label", "value", "disabled", "selected"]
            });
        }
    }
</script>

<div hidden>
    <slot />
</div>

<DropdownList
        {label}
        {items}
        webComponentMode={true}
        webComponentParentRow={parentRow}
        bind:value
        bind:errorElement
        bind:invalid
        bind:rootElement={instance}
        {multiple}
        {...rest}
/>
<link rel='stylesheet' href='{Utils.cssPath}'>
