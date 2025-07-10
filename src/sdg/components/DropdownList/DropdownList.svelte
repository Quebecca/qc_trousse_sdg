<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import DropdownListMultiple from "./DropdownListMultiple.svelte";
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";
    import {Utils} from "../utils";

    let {
        id = Math.floor(Math.random() * 1000),
        legend = "",
        width = "md",
        items,
        noValueMessage = "",
        noOptionsMessage = "Aucune option disponible",
        enableSearch = true,
        comboAriaLabel = "",
        ariaRequired = false,
        invalid = $bindable(""),
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
    });

    function handleDropdownButtonClick(event) {
        expanded = !expanded
        event.innerEventFromFilter = id
    }

    function handleOuterEvent(event) {
        if ((event.innerEventFromFilter ?? -1) !== id && !Utils.componentIsActive(instance)) {
            expanded = false;
        }
    }

    function handleKeyDown(event) {
        Utils.sleep(5).then(() => {
            if (event.key === "Escape" && expanded) {
                expanded = false;
            }
            if (event.key === "Tab" && !Utils.componentIsActive(instance)) {
                expanded = false;
            }
        }).catch(console.error);
    }

    function closeDropdown() {
        expanded = false;
        button.focus();
    }
</script>

<svelte:document onclick={handleOuterEvent} />

<Fieldset
        {id}
        {legend}
        {invalid}
        {ariaRequired}
        compact="true"
        {...rest}
>
    <div
        class="qc-dropdown-list"
        style="--dropdown-width: {usedWidth / (0.16 * precentRootFontSize)}rem;"
        role="listbox"
        tabindex="-1"
        bind:this={instance}
    >
        <button
                class="qc-dropdown-button"
                onclick={handleDropdownButtonClick}
                onkeydown={handleKeyDown}
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
                "qc-dropdown-list-items",
                !expanded && "qc-dropdown-list-items-hidden"
            ]}
             tabindex="-1"
        >
            {#if multiple}
                <DropdownListMultiple
                        {items}
                        passValue={(l, v) => {
                            placeholderText = l;
                            value = v;
                        }}
                        handleExit={() => closeDropdown()}
                />
            {:else}
                <DropdownListSingle
                        {items}
                        passValue={(l, v) => {
                            placeholderText = l;
                            value = v;
                            expanded = false;
                        }}
                        handleExit={() => closeDropdown()}
                />
            {/if}
        </div>
    </div>
</Fieldset>