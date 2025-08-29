<script>
    import {Utils} from "../../../utils";

    const selectedElementCLass = "qc-dropdown-list-single-selected";

    let {
        items,
        displayedItems,
        placeholder,
        selectionCallback = () => {},
        handleExit = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {}
    } = $props();

    $inspect("DropdownListItemsSingle:", placeholder)

    let displayedItemsElements = $state(new Array(displayedItems.length));

    export function focusOnFirstElement() {
        if (displayedItemsElements && displayedItemsElements.length > 0) {
            displayedItemsElements[0].focus();
        }
    }

    export function focusOnLastElement() {
        if (displayedItemsElements && displayedItemsElements.length > 0) {
            displayedItemsElements[displayedItemsElements.length - 1].focus();
        }
    }

    export function focusOnFirstMatchingElement(passedValue) {
        if (displayedItemsElements && displayedItemsElements.length > 0) {
            const foundElement = displayedItemsElements.find(
                el => el.dataset.itemValue.toString() === passedValue.toString()
            );
            if (foundElement) {
                foundElement.focus();
            }
        }
    }

    function handleSelection(event, item) {
        event.preventDefault();

        if (!item.disabled) {
            items.forEach(item => item.checked = false);
            items.find(option => option.value === item.value).checked = true;
            selectionCallback();
        }
    }

    function handleMouseUp(event, item) {
        handleSelection(event, item);
    }

    function handleComboKey(event, index, item) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItemsElements.length > 0 && index < displayedItemsElements.length - 1) {
                displayedItemsElements[index + 1].focus();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItemsElements.length > 0 && index > 0) {
                displayedItemsElements[index - 1].focus();
            } else {
                focusOnOuterElement();
            }
        }

        if (event.key === "Enter" || event.key === " ") {
            handleSelection(event, item);
        }

        Utils.sleep(5).then(() => {
            if (canExit(event, index)) {
                handleExit(event.key);
            }
        }).catch(console.error);
    }

    function handleKeyDown (event, index, item) {
        if (event.key.match(/^\w$/i)) {
            handlePrintableCharacter(event);
        } else {
            handleComboKey(event, index, item);
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === displayedItems.length - 1);
    }

    function itemsHaveIds() {
        let valid = true;
        displayedItems.forEach(item => {
            if (!item.id) {
                valid = false;
            }
        });
        return valid;
    }
</script>

{#if displayedItems.length > 0 && itemsHaveIds()}
    <ul>
        {#each displayedItems as item, index (item.id)}
            <li
                bind:this={displayedItemsElements[index]}
                id={item.id}
                class={[
                    "qc-dropdown-list-single",
                    item.disabled ? "qc-disabled" : "qc-dropdown-list-active",
                    item.checked ? selectedElementCLass : "",
                ]}
                data-item-value={item.value}
                tabindex="0"
                role="option"
                aria-selected={!!item.checked}
                onclick={(event) => handleMouseUp(event, item)}
                onkeydown={(event) => handleKeyDown(event, index, item)}
            >
                {#if !item.value && !item.label}
                    <span class="qc-sr-only">{@html placeholder}</span>
                {:else}
                    {@html item.label}
                {/if}
            </li>
        {/each}
    </ul>
{/if}