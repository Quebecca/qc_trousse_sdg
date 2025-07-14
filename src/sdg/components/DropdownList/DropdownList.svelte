<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import DropdownListMultiple from "./DropdownListMultiple.svelte";
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";

    let {
        id = Math.floor(Math.random() * 1000),
        legend = "",
        width = "md",
        items,
        noValueMessage = "",
        noOptionsMessage = "Aucune option disponible",
        enableSearch = false,
        comboAriaLabel = "",
        ariaRequired = false,
        invalid = $bindable(""),
        invalidText,
        searchPlaceholder = "",
        emptyOptionSrMessage = "",
        multiple = false,
        ...rest
    } = $props();

    const precentRootFontSize = 62.5
    let instance = $state(),
        button = $state(),
        value = $state(""),
        placeholderText = $state(""),
        expanded = $state(false),
        searchText = $state(""),
        displayedItems = $state(items),
        usedWidth = $derived.by(() => {
            switch (width) {
                case "sm":
                    return 156;
                case "lg":
                    return 528;
                default:
                    if (width.match(/^\d+$/)) {
                        return width;
                    }
                    return 342;
            }
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
</script>

<svelte:document onclick={handleOuterEvent} />

<Fieldset
        {id}
        {legend}
        {invalid}
        {invalidText}
        {ariaRequired}
        compact="true"
        {...rest}
>
    <div
        class="qc-dropdown-list"
        style="--dropdown-width: {usedWidth / (0.16 * precentRootFontSize)}rem;
               --dropdown-items-height: {usedHeight / (0.16 * precentRootFontSize)}rem;"
        role="listbox"
        tabindex="-1"
        bind:this={instance}
    >
        <button
                class="qc-dropdown-button"
                onclick={handleDropdownButtonClick}
                onkeydown={handleTab}
                aria-expanded={expanded}
                bind:this={button}
        >
                {#if Utils.isTruthy(value)}
                    <span class="qc-dropdown-choice">{placeholderText}</span>
                {:else}
                    <span class="qc-dropdown-placeholder">Choisissez une option</span>
                {/if}
            <span class={["qc-dropdown-button-icon", expanded && "qc-dropdown-button-icon-expanded"]}>
                <Icon type="chevron-white" size="sm" />
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
                                placeholderText = l;
                                value = v;
                            }}
                            handleExit={(key) => closeDropdown(key)}
                    />
                {:else}
                    <DropdownListSingle
                            items={displayedItems}
                            {noOptionsMessage}
                            passValue={(l, v) => {
                                placeholderText = l;
                                value = v;
                                expanded = false;
                            }}
                            handleExit={(key) => closeDropdown(key)}
                    />
                {/if}
            </div>
        </div>
    </div>
</Fieldset>