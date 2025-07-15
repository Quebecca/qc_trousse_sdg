<script>
    import DropdownListMultiple from "./DropdownListMultiple.svelte";
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import FormError from "../FormError/FormError.svelte";

    let {
        id = Math.random().toString(36).substring(2, 15),
        legend = "",
        width = "md",
        items,
        placeholder = "Choisissez une option:",
        noOptionsMessage = "Aucune option disponible",
        enableSearch = false,
        comboAriaLabel = "",
        ariaRequired = false,
        required = false,
        disabled = false,
        invalid = $bindable(false),
        invalidText,
        searchPlaceholder = "",
        emptyOptionSrMessage = "",
        multiple = false,
    } = $props();

    const precentRootFontSize = 62.5;
    const inputId = `${id}-input`;
    const labelId = `${id}-label`;
    const errorId = `${id}-error`;

    let instance = $state(),
        button = $state(),
        value = $state(""),
        selectedOptionsText = $state(""),
        expanded = $state(false),
        searchText = $state(""),
        displayedItems = $state(items),
        usedWidth = $derived.by(() => {
            // TODO transformer ces valeurs en tokens
            switch (width) {
                case "sm":
                    return 156;
                case "lg":
                    return 528;
                default:
                    return 249;
            }
        }),
        widthClass = $derived(`qc-dropdown-list--${width}`),
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
        Utils.sleep(5).then(() => {
            if (event.key === "Tab" && !Utils.componentIsActive(instance)) {
                expanded = false;
            }
        }).catch(console.error);
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
        style="--dropdown-width: {usedWidth / (0.16 * precentRootFontSize)}rem;
               --dropdown-items-height: {usedHeight / (0.16 * precentRootFontSize)}rem;"
        role="listbox"
        tabindex="-1"
        bind:this={instance}
    >
        <button
                id={inputId}
                class="qc-dropdown-button"
                onclick={handleDropdownButtonClick}
                onkeydown={handleTab}
                {disabled}
                aria-expanded={expanded}
                bind:this={button}
        >
                {#if Utils.isTruthy(value)}
                    <span class="qc-dropdown-choice">{selectedOptionsText}</span>
                {:else}
                    <span class="qc-dropdown-placeholder">{placeholder}</span>
                {/if}
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

            <div class="qc-dropdown-list-items" tabindex="-1">
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
            </div>
        </div>
    </div>

    {#if invalid}
        <FormError id={errorId} {invalid} {invalidText} />
    {/if}
</div>