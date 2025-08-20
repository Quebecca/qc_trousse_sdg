<script>
    import {Utils} from "../../../utils";

    const selectedElementCLass = "qc-dropdown-list-single-selected";
    const groupId = Utils.generateId();

    let {
        items,
        displayedItems,
        selectionCallback = () => {},
        handleExit = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {}
    } = $props();

    let self = $state();
    let selectedValue = $derived(items && items.length > 0 ? items.find((item) => item.checked)?.value : null);
    let selectedElement = $derived.by(() => {
        if (selectedValue && displayedItems && displayedItems.length > 0) {
            const foundElement = displayedItems.find(item => item.value === selectedValue)?.element;
            if (foundElement) {
                return foundElement;
            }
        }
        return previousSelectedElement && self && self.getRootNode().contains(previousSelectedElement)
            ? previousSelectedElement
            : null;
    });
    let previousSelectedElement = $state();

    $inspect(selectedElement, "selectedElement");
    $inspect(previousSelectedElement, "previousElement");
    $inspect(displayedItems, "displayedItems");

    export function focusOnFirstElement() {
        if (displayedItems && displayedItems.length > 0) {
            displayedItems[0].element.focus();
        }
    }

    export function focusOnLastElement() {
        if (displayedItems && displayedItems.length > 0) {
            displayedItems[displayedItems.length - 1].element.focus();
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (displayedItems && displayedItems.length > 0) {
            const foundElement = displayedItems.find(
                item => item.value.toString() === value.toString()
            )?.element;
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

            if (displayedItems.length > 0 && index < displayedItems.length - 1) {
                displayedItems[index + 1].element.focus();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItems.length > 0 && index > 0) {
                displayedItems[index - 1].element.focus();
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
</script>

{#if displayedItems.length > 0}
    <ul bind:this={self}>
        {#each displayedItems as item, index}
            <li
                bind:this={displayedItems[index].element}
                id={`${index}-${groupId}-${item.label}-${item.value}`}
                class={[
                    "qc-dropdown-list-single",
                    item.disabled ? "qc-disabled" : "qc-dropdown-list-active",
                    item.checked ? selectedElementCLass : "",
                ]}
                data-item-value={item.value}
                tabindex="0"
                role="option"
                aria-selected={selectedValue === item.value ? "true" : "false"}
                onclick={(event) => handleMouseUp(event, item)}
                onkeydown={(event) => handleKeyDown(event, index, item)}
            >
                {@html item.label}
            </li>
        {/each}
    </ul>
{/if}