<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import FormError from "../FormError/FormError.svelte";
    import DropdownListItems from "./DropdownListItems/DropdownListItems.svelte";
    import DropdownListButton from "./DropdownListButton/DropdownListButton.svelte";

    const lang = Utils.getPageLanguage();

    let {
        id = Math.random().toString(36).substring(2, 15),
        label = "",
        width = "md",
        items = [],
        value = $bindable(),
        placeholder = lang === "fr" ? "Choisissez une option:" : "Choose an option:",
        noOptionsMessage = lang === "fr" ? "Aucun élément" : "No item",
        enableSearch = false,
        required = false,
        disabled = false,
        invalid = $bindable(false),
        invalidText,
        searchPlaceholder = "",
        multiple = false,
    } = $props();

    const
        inputId = `${id}-input`,
        popupId = `${id}-popup`,
        itemsId = `${id}-items`,
        labelId = `${id}-label`,
        errorId = `${id}-error`,
        availableWidths = ["xs", "sm", "md", "lg", "xl"],
        defaultInvalidText = `Le champ ${label} est obligatoire.`
    ;

    let instance = $state(),
        button = $state(),
        searchInput = $state(),
        dropdownItems = $state(),
        selectedItems = $derived(items.filter((item) => item.checked) ?? []),
        selectedOptionsText = $derived(
            items.length > 0 ?
                multiple ?
                    selectedItems?.map((item) => item.label).join(", ")
                    : selectedItems[0]?.label
                : ""
        ),
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
            if (availableWidths.includes(width)) {
                return `qc-textfield-container-${width}`;
            }
            return `qc-textfield-container-md`;
        }),
        srItemsCountText = $derived.by(() => {
            const s = displayedItems.length > 1 ? "s" : "";
            if (displayedItems.length > 0) {
                return  lang === "fr" ?
                    `${displayedItems.length} résultat${s} disponible${s}. Utilisez les flèches directionnelles haut et bas pour vous déplacer dans la liste.`
                    : `${displayedItems.length} result${s} available. Use up and down arrow keys to navigate through the list.`;
            }

            return "";
        })
    ;

    function focusOnSelectedOption(value) {
        if (displayedItems.length > 0) {
            if (value && value.length > 0) {
                dropdownItems?.focusOnFirstMatchingElement(value.split(", ")?.sort()[0]);
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
                expanded = true;
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

    function handleSearchKeyDown(event) {
        if (event.key === "ArrowDown" && displayedItems?.length > 0) {
            event.preventDefault();
            // event.stopPropagation();
            dropdownItems?.focus();
        }

        if (event.key === "ArrowUp") {
            button?.focus();
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
        if (value) {
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
        value = selectedItems?.map(item => item.value).join(", ");
    });
</script>

<svelte:body onclick={handleOuterEvent} onkeydown={handleTab} />
<div class={`qc-textfield-container ${widthClass}`}>
    <div class="qc-dropdown-list-label-container">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <label
            class={[
                "qc-label",
                "qc-label-bold",
                disabled && "qc-disabled"
            ]}
            for={inputId}
            id={labelId}
            onclick={(e) => {
                e.preventDefault();
                button.focus();
            }}
        >
            {label}
            {#if required}
                <span class="qc-required" aria-hidden="true">*</span>
            {/if}
        </label>
        {#if multiple && selectedItems.length > 0}
            <div class="qc-dropdown-list-selection-count">
                {#if lang === "fr"}
                    {selectedItems.length} sélection{selectedItems.length > 1 ? "s" : ""}
                {:else}
                    {selectedItems.length} selection{selectedItems.length > 1 ? "s" : ""}
                {/if}
            </div>
        {/if}
    </div>
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
                            // handleArrowDown(e, dropdownItems);
                            // handleArrowUp(e, button);
                            // if (e.key === "Enter") {
                            //     e.preventDefault();
                            // }
                            handleSearchKeyDown(e);
                        }}
                    />
                </div>
            {/if}

            <DropdownListItems
                id={itemsId}
                {enableSearch}
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
            />

            <!-- Pour les lecteurs d'écran: lit le nombre de résultats -->
            <div role="status" class="qc-sr-only">
                {#key searchText}
                    <span>{srItemsCountText}</span>
                {/key}
            </div>
        </div>
    </div>

    <FormError id={errorId} {invalid} invalidText={invalidText ?? defaultInvalidText} />
</div>
