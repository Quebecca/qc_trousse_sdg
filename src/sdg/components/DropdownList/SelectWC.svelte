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
    import {onDestroy, onMount, tick} from "svelte";
    import DropdownList from "./DropdownList.svelte";
    import {Utils} from "../utils";

    let {
        invalid = $bindable(false),
        value = $bindable([]),
        multiple,
        disabled,
        required,
        label,
        placeholder,
        width,
        ...rest
    } = $props();

    const nestedSelects = $host().querySelector("qc-select");

    let selectElement = $state();
    let items = $state();
    let labelElement = $state();
    let observer = new MutationObserver(setupItemsList);
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["label", "value", "disabled", "selected"]
    };
    let instance = $state();
    let errorElement = $state();
    let parentRow = $derived($host().closest(".qc-formfield-row"));
    let internalChange = false;

    onMount(() => {
        selectElement = $host().querySelector("select");
        labelElement = $host().querySelector("label");
        if (labelElement) {
            label = labelElement.innerHTML;
        }

        if (selectElement) {
            multiple = selectElement.multiple;
            disabled = selectElement.disabled;

            selectElement.addEventListener("change", handleSelectChange);

            if (nestedSelects) {
                console.warn("Imbrication d'éléments 'qc-select' détectée.");
            } else {
                observer.observe(selectElement, observerOptions);
            }
        }
        setupItemsList();
        $host().classList.add("qc-select");
    });

    onDestroy(() => {
        observer?.disconnect();
        selectElement.removeEventListener("change", handleSelectChange);
    });

    $effect(() => {
        if (!selectElement) return;
        if (!selectElement.options) return;
        internalChange = true;
        let newOptionSelected = false;
        for (const option of selectElement.options) {
                const selected = value.includes(option.value);
                if (selected !== option.selected) {
                    option.toggleAttribute("selected", selected);
                    option.selected = selected;
                    newOptionSelected = true;
            }
        }
        if (newOptionSelected) {
            selectElement.dispatchEvent(new Event('change'));
        }
        tick().then(() => internalChange = false)
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

    function handleSelectChange() {
        if (internalChange) return;
        setupItemsList();
    }
</script>

<div hidden>
    <slot />
</div>

<DropdownList
        {label}
        ariaLabel={selectElement?.getAttribute("aria-label")}
        {items}
        {placeholder}
        {width}
        webComponentMode={true}
        bind:value
        bind:errorElement
        bind:invalid
        bind:rootElement={instance}
        {multiple}
        {disabled}
        {required}
        {...rest}
/>
<link rel='stylesheet' href='{Utils.cssPath}'>
