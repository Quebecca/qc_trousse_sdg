<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import FormError from "../FormError/FormError.svelte";
    import DropdownListItems from "./DropdownListItems/DropdownListItems.svelte";
    import DropdownListButton from "./DropdownListButton/DropdownListButton.svelte";
    import Label from "../Label/Label.svelte";

    const lang = Utils.getPageLanguage();

    let {
        id = Math.random().toString(36).substring(2, 15),
        label = "",
        ariaLabel = "",
        width = "md",
        items = [],
        value = $bindable([]),
        placeholder,
        noOptionsMessage = lang === "fr" ? "Aucun élément" : "No item",
        enableSearch = false,
        required = false,
        disabled = false,
        invalid = $bindable(false),
        invalidText,
        searchPlaceholder = "",
        multiple = false,
        rootElement = $bindable(),
        errorElement = $bindable(),
        webComponentMode = false,
        webComponentParentRow,
    } = $props();

    const
        defaultPlaceholder = lang === "fr" ? "Faire une sélection" : "Select an option",
        inputId = `${id}-input`,
        popupId = `${id}-popup`,
        itemsId = `${id}-items`,
        labelId = `${id}-label`,
        errorId = `${id}-error`,
        availableWidths = ["xs", "sm", "md", "lg", "xl"]
    ;

    let
        instance = $state(),
        parentRow = $derived(instance?.closest(".qc-formfield-row")),
        button = $state(),
        searchInput = $state(),
        dropdownItems = $state(),
        selectedItems = $derived(items.filter((item) => item.checked) ?? []),
        selectedOptionsText = $derived.by(() => {
            if (selectedItems.length >= 3) {
                if (lang === "fr") {
                    return `${selectedItems.length} options sélectionnées`;
                }
                return `${selectedItems.length} selected options`;
            }

            if (selectedItems.length > 0 && value.length > 0) {
                if (multiple) {
                    return selectedItems.map((item) => item.label).join(", ");
                }
                return selectedItems[0].label;
            }

            return "";
        }),
        previousValue = $state(value),
        expanded = $state(false),
        searchText = $state(""),
        hiddenSearchText = $state(""),
        displayedItems = $state(items),
        itemsForSearch = $derived(items.map((item) => {
            return {
                label: Utils.cleanupSearchPrompt(item.label),
                value: item.value,
                disabled: item.disabled,
                checked: item.checked,
            }
        })),
        widthClass = $derived.by(() => {
            const keyword = webComponentMode ? "container" : "root";

            if (availableWidths.includes(width)) {
                return `qc-dropdown-list-${keyword}-${width}`;
            }
            return `qc-dropdown-list-${keyword}-md`;
        }),
        srItemsCountText = $derived.by(() => {
            const s = displayedItems.length > 1 ? "s" : "";
            if (displayedItems.length > 0) {
                return lang === "fr" ?
                    `${displayedItems.length} résultat${s} disponible${s}. Utilisez les flèches directionnelles haut et bas pour vous déplacer dans la liste.`
                    : `${displayedItems.length} result${s} available. Use up and down arrow keys to navigate through the list.`;
            }

            return "";
        })
    ;

    function focusOnSelectedOption(value) {
        if (displayedItems.length > 0) {
            if (value && value.length > 0) {
                dropdownItems?.focusOnFirstMatchingElement($state.snapshot(value)?.sort()[0]);
            } else {
                dropdownItems?.focus();
            }
        }
    }

    function handleDropdownButtonClick(event) {
        event.preventDefault();
        expanded = !expanded;
    }

    function handleOuterEvent() {
        if (!Utils.componentIsActive(instance)) {
            expanded = false;
        }
    }

    function handleTab(event) {
        // Le changement de focus a lieu après le lancement de l'événement clavier.
        // Il faut donc faire un court sleep pour avoir le nouvel élément en focus.
        Utils.sleep(5).then(() => {
            if (event.key === "Tab" && !Utils.componentIsActive(instance)) {
                expanded = false;
            }
        }).catch(console.error);
    }

    function handleEscape(event) {
        if (event.key === "Escape") {
            expanded = false;
        }
    }

    function handleArrowUp(event, targetComponent) {
        if (event.key === "ArrowUp" && targetComponent) {
            event.preventDefault();
            targetComponent.focus();
        }
    }

    function handleArrowDown(event, targetComponent) {
        if (event.key === "ArrowDown" && targetComponent) {
            event.preventDefault();
            expanded = true;
            targetComponent.focus();
        }
    }

    function handleButtonComboKey(event, targetComponent) {
        handleEscape(event);
        handleTab(event);

        if (event.key === "ArrowDown") {
            event.preventDefault();
            if (expanded) {
                targetComponent.focus();
            } else {
                expanded = true;
                focusOnSelectedOption(value);
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            if (expanded) {
                dropdownItems?.focusOnLastElement();
            }
        }
    }

    function handlePrintableCharacter(event) {
        if (enableSearch) {
            searchInput?.focus();
        } else {
            hiddenSearchText += event.key;
            if (hiddenSearchText.length > 0 && expanded) {
                dropdownItems?.focusOnFirstMatchingElement(hiddenSearchText);
            }
        }
    }

    function handleButtonKeyDown(event, targetComponent) {
        if (event.key.match(/^\w$/i)) {
            handlePrintableCharacter(event);
        } else {
            handleButtonComboKey(event, targetComponent);
        }
    }

    function closeDropdown(key) {
        expanded = false;
        hiddenSearchText = "";
        if (key === "Escape" && button) {
            button.focus();
        }
    }

    $effect(() => {
        if (searchText.length > 0) {
            let newDisplayedItems = [];
            for (let i = 0; i < items.length; i++) {
                if (itemsForSearch[i].label.includes(Utils.cleanupSearchPrompt(searchText))) {
                    newDisplayedItems.push(items[i]);
                }
            }

            displayedItems = newDisplayedItems;
        } else {
            displayedItems = items;
        }
    });

    $effect(() => {
        if (previousValue?.toString() !== value?.toString()) {
            invalid = false;
        }
    });

    $effect(() => {
        if (!expanded) {
            hiddenSearchText = "";
            searchText = "";
        }
    });

    $effect(() => {
        const tempValue = selectedItems?.map(item => item.value);
        if (tempValue?.toString() !== "") {
            value = tempValue;
        } else {
            value = [];
        }
    });

    $effect(() => {
        items.forEach((item) => {
            if (!item.id) {
                item.id = `${id}-${item.label.toString().replace(/(\(|\))/gmi, "").replace(/\s+/, "-")}-${item.value?.toString().replace(/(\(|\))/gmi, "").replace(/\s+/, "-")}`;
            }
        });
    });

    $effect(() => {
        if (parentRow && errorElement && !webComponentMode) {
            parentRow.appendChild($state.snapshot(errorElement));
        }
    });

    $effect(() => {
        if (placeholder)  return;
        const optionWithEmptyValue = findOptionWithEmptyValue();
        if (!optionWithEmptyValue) return;
        placeholder =
            optionWithEmptyValue.label !== ""
                ?  optionWithEmptyValue.label
                : defaultPlaceholder
        ;
    })


    function findOptionWithEmptyValue() {
        return items?.find(
            item => item.value === ""
                || item.value === null
                || item.value === undefined
        );
    }
</script>

<svelte:body onclick={handleOuterEvent} onkeydown={handleTab}/>
<div
        class={[
        "qc-dropdown-list-root",
        !webComponentMode && widthClass,
        !parentRow && !webComponentMode && "qc-select"
    ]} bind:this={rootElement}
>
    <div class={[
            "qc-dropdown-list-container",
            webComponentMode && widthClass
        ]}>
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        {#if label}
            <Label
                    {required}
                    {disabled}
                    text={label}
                    forId={inputId}
                    onclick={(e) => {
                        e.preventDefault();
                        button.focus();
                    }}
                    bold={true}
                    id={labelId}
            />
        {/if}
        <div
                class={[
                `qc-dropdown-list`,
                invalid && "qc-dropdown-list-invalid",
            ]}
                tabindex="-1"
                bind:this={instance}
        >
            <DropdownListButton
                    {inputId}
                    {disabled}
                    {expanded}
                    aria-labelledby={labelId}
                    aria-required={required}
                    aria-expanded={expanded}
                    aria-haspopup="listbox"
                    aria-controls={itemsId}
                    aria-invalid={invalid}
                    {selectedOptionsText}
                    {placeholder}
                    onclick={handleDropdownButtonClick}
                    onkeydown={(e) => {
                    handleButtonKeyDown(e, enableSearch ? searchInput : dropdownItems);
                }}
                    bind:this={button}
            />

            <div
                    id={popupId}
                    class="qc-dropdown-list-expanded"
                    tabindex="-1"
                    hidden={!expanded}
                    role="listbox"
            >

                {#if enableSearch}
                    <div class="qc-dropdown-list-search">
                        <SearchInput
                                id="{id}-search"
                                bind:value={searchText}
                                placeholder={searchPlaceholder}
                                ariaLabel={searchPlaceholder ? searchPlaceholder : undefined}
                                leftIcon="true"
                                bind:this={searchInput}
                                onkeydown={(e) => {
                                handleArrowDown(e, dropdownItems);
                                handleArrowUp(e, button);
                                if (e.key === "Enter") {
                                    e.preventDefault();
                                }
                            }}
                        />
                    </div>
                {/if}

                <DropdownListItems
                        id={itemsId}
                        {enableSearch}
                        {placeholder}
                        {multiple}
                        {items}
                        {displayedItems}
                        {noOptionsMessage}
                        selectionCallbackSingle={() => {
                        closeDropdown("");
                        button?.focus();
                    }}
                        handleExitSingle={(key) => closeDropdown(key)}
                        handleExitMultiple={(key) => closeDropdown(key)}
                        focusOnOuterElement={() => enableSearch ? searchInput?.focus() : button?.focus()}
                        handlePrintableCharacter={handlePrintableCharacter}
                        bind:this={dropdownItems}
                        bind:value={value}
                />

                <!-- Pour les lecteurs d'écran: lit le nombre de résultats -->
                <div role="status" class="qc-sr-only">
                    {#key searchText}
                        <span>{srItemsCountText}</span>
                    {/key}
                </div>
            </div>
        </div>

    </div>

    <FormError id={errorId}
               bind:rootElement={errorElement}
               {invalid}
               {invalidText}
               extraClasses={["qc-xs-mt"]}
               label={label ?? ariaLabel}
    />
</div>
