<script>
    import DropdownListMultiple from "./DropdownListMultiple.svelte";
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import FormError from "../FormError/FormError.svelte";

    let {
        id = Math.random().toString(36).substring(2, 15),
        value = $bindable(),
        legend = "",
        width = "lg",
        items,
        placeholder = "Choisissez une option:",
        noOptionsMessage = "Aucun élément",
        enableSearch = false,
        required = false,
        disabled = false,
        invalid = $bindable(false),
        invalidText = "Veuillez sélectionner au moins une option.",
        searchPlaceholder = "",
        multiple = false,
    } = $props();

    const precentRootFontSize = 62.5,
        inputId = `${id}-input`,
        labelId = `${id}-label`,
        errorId = `${id}-error`,
        availableWidths = ["sm", "md", "lg", "xl", "xxl"]
    ;

    let instance = $state(),
        button = $state(),
        selectedOptionsText = $state(""),
        expanded = $state(false),
        searchText = $state(""),
        displayedItems = $state(items),
        widthClass = $derived.by(() => {
            if (availableWidths.includes(width)) {
                return `qc-dropdown-list-${width}`;
            }
            return `qc-dropdown-list-lg`;
        }),
        usedHeight = $derived.by(() => {
            const maxItemsHeight = 330;
            const searchInputTotalHeight = 56;

            if (enableSearch) {
                return maxItemsHeight - searchInputTotalHeight;
            } else {
                return maxItemsHeight;
            }
        })
    ;

    function handleDropdownButtonClick(event) {
        expanded = !expanded
        event.innerEventFromFilter = id
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

    function closeDropdown(key) {
        expanded = false;
        if (key === "Escape") {
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
        if (Utils.isTruthy(value)) {
            invalid = false;
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
            <span class="qc-textfield-required" aria-hidden="true">*</span>{/if}
    </label>
    <div
        class={[
            `qc-dropdown-list ${widthClass}`,
            invalid && "qc-dropdown-list-invalid",
        ]}
        style="--dropdown-items-height: {usedHeight / (0.16 * precentRootFontSize)}rem;"
        role="listbox"
        tabindex="-1"
        bind:this={instance}
    >
        <button
                id={inputId}
                class="qc-dropdown-button"
                onclick={handleDropdownButtonClick}
                onkeydown={(e) => {handleTab(e); handleEscape(e)}}
                {disabled}
                aria-expanded={expanded}
                bind:this={button}
        >
            <span class="qc-dropdown-text">
                {#if selectedOptionsText.length > 0}
                    <span class="qc-dropdown-choice">{selectedOptionsText}</span>
                {:else}
                    <span class="qc-dropdown-placeholder">{placeholder}</span>
                {/if}
            </span>

            <span class={["qc-dropdown-button-icon", expanded && "qc-dropdown-button-icon-expanded"]}>
                <Icon
                    type={disabled ? "chevron-grey-thin" : "chevron-blue-thin"}
                    size="sm"
                />
            </span>
        </button>
        <div class={[
                "qc-dropdown-list-expanded",
                !expanded && "qc-dropdown-list-hidden"
            ]}
             tabindex="-1"
        >
            {#if enableSearch}
                <div class="qc-dropdown-list-search">
                    <SearchInput
                            id="{id}-search"
                            bind:value={searchText}
                            placeholder={searchPlaceholder}
                            liveRefresh="true"
                    />
                </div>
            {/if}

            <div class="qc-dropdown-list-items" tabindex="-1" role="status">
                {#if multiple}
                    <DropdownListMultiple
                            items={displayedItems}
                            {noOptionsMessage}
                            passValue={(l, v) => {
                                selectedOptionsText = l;
                                value = v;
                            }}
                            handleExit={(key) => closeDropdown(key)}
                    />
                {:else}
                    <DropdownListSingle
                            items={displayedItems}
                            {noOptionsMessage}
                            passValue={(l, v) => {
                                selectedOptionsText = l;
                                value = v;
                                expanded = false;
                            }}
                            handleExit={(key) => closeDropdown(key)}
                    />
                {/if}

                <div class="qc-dropdown-list-no-options" role="alert">
                    {#if displayedItems.length <= 0}
                        {#await Utils.sleep(100) then _}
                            {noOptionsMessage}
                        {/await}
                    {/if}
                </div>
            </div>
        </div>
    </div>

    {#if invalid}
        <FormError id={errorId} {invalid} {invalidText} />
    {/if}
</div>