<script>
    import DropdownListItemsSingle from "./DropdownListItemsSingle/DropdownListItemsSingle.svelte";
    import DropdownListItemsMultiple from "./DropdownListItemsMultiple/DropdownListItemsMultiple.svelte";
    import {tick} from "svelte";
    import {Utils} from "../../utils";

    let {
        id,
        enableSearch,
        multiple,
        displayedItems,
        noOptionsMessage,
        passValueSingle = () => {},
        passValueMultiple = () => {},
        handleExitSingle = () => {},
        handleExitMultiple = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {},
    } = $props()

    const
        precentRootFontSize = 62.5,
        remRatio = 0.16
    ;

    let itemsComponent = $state();
    let usedHeight = $derived.by(() => {
        const maxItemsHeight = 336;
        const searchInputTotalHeight = 56;

        if (enableSearch) {
            if (displayedItems.length > 7) {
                return maxItemsHeight - searchInputTotalHeight - 17;
            }
            return maxItemsHeight - searchInputTotalHeight;
        } else {
            if (displayedItems.length > 8) {
                return maxItemsHeight - 33;
            }
            return maxItemsHeight;
        }
    });

    export function focus() {
        if (itemsComponent) {
            itemsComponent.focusOnFirstElement();
        }
    }

    export function focusOnLastElement() {
        if (itemsComponent) {
            itemsComponent.focusOnLastElement();
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (itemsComponent && value && value.length > 0) {
            Utils.sleep(5).then(() => {
                itemsComponent?.focusOnFirstMatchingElement(value);
            }).catch(console.error);
        }
    }
</script>

<div
    id={id}
    class="qc-dropdown-list-items"
    tabindex="-1"
    role="status"
    style="--dropdown-items-height: {usedHeight / (remRatio * precentRootFontSize)}rem;"
>
    {#if multiple}
        <DropdownListItemsMultiple
                items={displayedItems}
                {noOptionsMessage}
                passValue={(l, v) => {
                    passValueMultiple(l, v)
                }}
                handleExit={(key) => handleExitMultiple(key)}
                focusOnOuterElement={focusOnOuterElement}
                handlePrintableCharacter={handlePrintableCharacter}
                bind:this={itemsComponent}
        />
    {:else}
        <DropdownListItemsSingle
                items={displayedItems}
                {noOptionsMessage}
                passValue={(l, v) => {
                    passValueSingle(l, v)
                }}
                handleExit={(key) => handleExitSingle(key)}
                focusOnOuterElement={focusOnOuterElement}
                handlePrintableCharacter={handlePrintableCharacter}
                bind:this={itemsComponent}
        />
    {/if}

    <div class="qc-dropdown-list-no-options-container" role="status" aria-live="polite" aria-atomic="true">
        {#if displayedItems.length <= 0}
            {#await tick() then _}
                <span class="qc-dropdown-list-no-options">{@html noOptionsMessage}</span>
            {/await}
        {/if}
    </div>
</div>