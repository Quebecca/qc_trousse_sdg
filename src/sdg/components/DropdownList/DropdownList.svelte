<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import FormError from "../FormError/FormError.svelte";
    import DropdownListItems from "./DropdownListItems/DropdownListItems.svelte";
    import DropdownListButton from "./DropdownListButton/DropdownListButton.svelte";

    const lang = Utils.getPageLanguage();

    let {
        id = Math.random().toString(36).substring(2, 15),
        value = $bindable(),
        legend = "",
        width = "lg",
        items,
        placeholder = lang === "fr" ? "Choisissez une option:" : "Choose an option:",
        noOptionsMessage = lang=== "fr" ? "Aucun élément" : "No item",
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
        itemsId = `${id}-items`,
        labelId = `${id}-label`,
        errorId = `${id}-error`,
        availableWidths = ["sm", "md", "lg", "xl", "xxl"],
        defaultInvalidText = `Le champ ${legend} est obligatoire.`
    ;

    let instance = $state(),
        button = $state(),
        searchInput = $state(),
        dropdownItems = $state(),
        selectedOptionsText = $state(""),
        expanded = $state(false),
        searchText = $state(""),
        hiddenSearchText = $state(""),
        displayedItems = $state(items),
        widthClass = $derived.by(() => {
            if (availableWidths.includes(width)) {
                return `qc-dropdown-list-${width}`;
            }
            return `qc-dropdown-list-lg`;
        }),
        itemsCountText = $derived.by(() => {
            if (displayedItems.length > 0 && expanded) {
                return  lang === "fr" ?
                    `${displayedItems.length} résultats disponibles. Utilisez les flèches directionnelles pour vous déplacer dans la liste.`
                    : `${displayedItems.length} results available. Use arrow keys to navigate through the list.`;
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
        event.innerEventFromFilter = id;
    }

    function handleOuterEvent(event) {
        if ((event.innerEventFromFilter ?? -1) !== id && !Utils.componentIsActive(instance)) {
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

    $effect(() => {
        if (searchText.length > 0) {
            displayedItems = items.filter((item) => {
                return item.label.toLowerCase().includes(searchText.toLowerCase())
            });
        } else {
            displayedItems = items;
        }
    })

    $effect(() => {
        if (value) {
            invalid = false;
        }
    })

    $effect(() => {
        if (!expanded) {
            hiddenSearchText = "";
            searchText = "";
        }
    })
</script>

<svelte:document onclick={handleOuterEvent} />
<div class={[
    'qc-textfield-container',
     disabled && "qc-disabled"
]}>
    <label for={inputId} id={labelId}>
        {legend}
        {#if required}
            <span class="qc-textfield-required" aria-hidden="true">*</span>
        {/if}
    </label>
    <div
        class={[
            `qc-dropdown-list ${widthClass}`,
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
            aria-controls={itemsId}
            aria-required={required}
            aria-expanded={expanded}
            aria-haspopup="listbox"
            aria-owns={itemsId}
            aria-invalid={invalid}
            aria-label={selectedOptionsText}
            {selectedOptionsText}
            {placeholder}
            onclick={handleDropdownButtonClick}
            onkeydown={(e) => {
                handleButtonKeyDown(e, enableSearch ? searchInput : dropdownItems);
            }}
            bind:this={button}
        />

        <div
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
                        leftIcon="true"
                        bind:this={searchInput}
                        onkeydown={(e) => {
                            handleArrowDown(e, dropdownItems);
                            handleArrowUp(e, button);
                        }}
                    />
                </div>
            {/if}

            <DropdownListItems
                id={itemsId}
                {enableSearch}
                {multiple}
                {displayedItems}
                {noOptionsMessage}
                passValueSingle={(l, v) => {
                    selectedOptionsText = l;
                    value = v;
                    expanded = false;
                    button?.focus();
                }}
                passValueMultiple={(l, v) => {
                    selectedOptionsText = l;
                    value = v;
                }}
                handleExitSingle={(key) => closeDropdown(key)}
                handleExitMultiple={(key) => closeDropdown(key)}
                focusOnOuterElement={() => enableSearch ? searchInput?.focus() : button?.focus()}
                handlePrintableCharacter={handlePrintableCharacter}
                bind:this={dropdownItems}
            />

            <!-- Pour les lecteurs d'écran: affiche le nombre de résultats -->
            <div aria-label={itemsCountText} role="status" aria-live="polite" aria-atomic="true"></div>
        </div>
    </div>

    <FormError id={errorId} {invalid} invalidText={invalidText ?? defaultInvalidText} />
</div>