<script>
    import DropdownListItemsSingle from "./DropdownListItemsSingle/DropdownListItemsSingle.svelte";
    import DropdownListItemsMultiple from "./DropdownListItemsMultiple/DropdownListItemsMultiple.svelte";
    import {tick} from "svelte";

    let {
        multiple,
        displayedItems,
        noOptionsMessage,
        passValueSingle = () => {},
        passValueMultiple = () => {},
        handleExitSingle = () => {},
        handleExitMultiple = () => {},
    } = $props()
</script>

<div class="qc-dropdown-list-items" tabindex="-1" role="status">
    {#if multiple}
        <DropdownListItemsMultiple
                items={displayedItems}
                {noOptionsMessage}
                passValue={(l, v) => {
                    passValueMultiple(l, v)
                }}
                handleExit={(key) => handleExitMultiple(key)}
        />
    {:else}
        <DropdownListItemsSingle
                items={displayedItems}
                {noOptionsMessage}
                passValue={(l, v) => {
                    passValueSingle(l, v)
                }}
                handleExit={(key) => handleExitSingle(key)}
        />
    {/if}

    <div class="qc-dropdown-list-no-options-container" role="alert">
        {#if displayedItems.length <= 0}
            {#await tick() then _}
                <span class="qc-dropdown-list-no-options">{noOptionsMessage}</span>
            {/await}
        {/if}
    </div>
</div>