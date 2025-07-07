<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import DropdownListMultiple from "./DropdownListMultiple.svelte";
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";
    import {Utils} from "../utils";

    let {
        id = Math.floor(Math.random() * 1000),
        legend = '',
        width = "auto",
        items,
        noValueMessage = '',
        noOptionsMessage = ' Aucune option disponible',
        enableSearch = true,
        comboAriaLabel = '',
        ariaRequired = false,
        invalid = $bindable(''),
        searchPlaceholder = '',
        emptyOptionSrMessage = '',
        multiple = false,
        ...rest
    } = $props();

    let value = $state('');
    let focusIn = $state(false);
    const name = Math.random().toString(36).substring(2, 15);
    let expanded = $state(false);
    let usedWidth = $derived.by(() => {
        switch (width) {
            case "sm":
                return 156;
            case "lg":
                return 528;
            default:
                return 342;
        }
    });

    function handleDropdownButtonClick(event) {
        expanded = !expanded
        event.innerEventFromFilter = id
    }

    function handleOuterEvent(event) {
        if ((event.innerEventFromFilter ?? -1) !== id && !focusIn) {
            expanded = false;
        }
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
            style="--dropdown-width: {usedWidth/10}rem;"
            role="listbox"
    >
        <button class="qc-dropdown-button"
                onclick={handleDropdownButtonClick} aria-expanded={expanded}>
            {#if Utils.isTruthy(value)}
                {value}
            {:else}
                Choisissez une option
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
             onmouseenter={() => focusIn = true}
             onmouseleave={() => focusIn = false}
        >
            {#if multiple}
                <DropdownListMultiple {items} {name} {value} />
            {:else}
                <DropdownListSingle {items} passValue={(v) => {value = v; expanded = false;}} />
            {/if}
        </div>
    </div>
</Fieldset>