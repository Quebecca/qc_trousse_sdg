<script>
    import DropdownListItemsSingle from "./DropdownListItemsSingle/DropdownListItemsSingle.svelte";
    import DropdownListItemsMultiple from "./DropdownListItemsMultiple/DropdownListItemsMultiple.svelte";
    import {tick} from "svelte";
    import {Utils} from "../../utils";

    let {
        id,
        multiple,
        items,
        displayedItems,
        noOptionsMessage,
        selectionCallbackSingle = () => {},
        selectionCallbackMultiple = () => {},
        handleExitSingle = () => {},
        handleExitMultiple = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {},
        placeholder,
    } = $props();

    let itemsComponent = $state();

    export function focus() {
        tick().then(() => {
            itemsComponent?.focusOnFirstElement();
        }).catch(console.error);
    }

    export function focusOnLastElement() {
        tick().then(() => {
            itemsComponent?.focusOnLastElement();
        }).catch(console.error);
    }

    export function focusOnFirstMatchingElement(value) {
        if (itemsComponent && value && value.length > 0) {
            tick().then(() => {
                itemsComponent?.focusOnFirstMatchingElement(value);
            }).catch(console.error);
        }
    }
</script>

<div
    id={id}
    class="qc-dropdown-list-items"
    tabindex="-1"
>
    {#if multiple}
        <DropdownListItemsMultiple
            {items}
            {displayedItems}
            {noOptionsMessage}
            passValue={() => {
                selectionCallbackMultiple();
            }}
            handleExit={(key) => handleExitMultiple(key)}
            focusOnOuterElement={focusOnOuterElement}
            handlePrintableCharacter={handlePrintableCharacter}
            bind:this={itemsComponent}
        />
    {:else}
        <DropdownListItemsSingle
            {items}
            {displayedItems}
            {noOptionsMessage}
            selectionCallback={() => {
                selectionCallbackSingle();
            }}
            handleExit={(key) => handleExitSingle(key)}
            focusOnOuterElement={focusOnOuterElement}
            handlePrintableCharacter={handlePrintableCharacter}
            {placeholder}
            bind:this={itemsComponent}
        />
    {/if}

    <div class="qc-dropdown-list-no-options-container" role="status">
        {#if displayedItems.length <= 0}
            {#await tick() then _}
                <span class="qc-dropdown-list-no-options">{@html noOptionsMessage}</span>
            {/await}
        {/if}
    </div>

</div>