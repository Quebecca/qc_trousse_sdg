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
        value = $bindable([]),
        multiple,
        disabled,
        required,
        label,
        placeholder,
        width,
        ...rest
    } = $props();

    const availableWidths = ["xs", "sm", "md", "lg", "xl"];

    let selectElement = $state();
    let items = $state();
    let labelElement = $state();
    let observer;
    let instance = $state();
    let errorElement = $state();
    let parentRow = $derived($host().closest(".qc-formfield-row"));
    let widthClass = $derived.by(() => {
        if (availableWidths.includes(width)) {
            return `qc-dropdown-list-root-${width}`;
        }
        return `qc-dropdown-list-root-md`;
    });
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
        }

        setupItemsList();
        setupObserver();

        $host().classList.add("qc-select");
    });

    onDestroy(() => {
        observer?.disconnect();
        selectElement.removeEventListener("change", handleSelectChange);
    });

    $effect(() => {
        if (
            selectElement
            && selectElement.options
            && selectElement.options.length > 0
            && value
            // Comparaison sur les strings, car les tableaux ont des références toujours différentes
            // && value.toString() !== previousValue.toString()
        ) {
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
            setTimeout(() => {
                internalChange = false;
            }, 0);
        }
    });

    $effect(() => {
       if (parentRow && errorElement) {
           parentRow.appendChild(errorElement);
       }
    });

    $effect(() => {
       if (widthClass) {
           $host().classList.add("qc-dropdown-list-root");
           $host().classList.add(widthClass);
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
                subtree: true,
                attributes: true,
                attributeFilter: ["label", "value", "disabled", "selected"]
            });
        }
    }

    function handleSelectChange() {
        if (internalChange) {
            return;
        }

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
        webComponentParentRow={parentRow}
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
