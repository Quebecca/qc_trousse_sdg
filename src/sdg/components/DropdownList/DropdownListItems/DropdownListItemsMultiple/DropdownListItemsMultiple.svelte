<script>
    import {Utils} from "../../../utils";
    import Checkbox from "../../../Checkbox/Checkbox.svelte";

    let {
        displayedItems,
        handleExit = () => {},
        selectionCallback = () => {
        },
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {}
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let
        selectedValues = $state(
            displayedItems && displayedItems.length > 0 ?
                displayedItems.filter(item => item.checked).map(item => item.value)
                : []
        ),
        selectedLabels = $state(
            displayedItems && displayedItems.length > 0 ?
                displayedItems.filter(item => item.checked).map(item => item.label)
                : []
        ),
        self = $state(),
        listElements = $derived(self ? Array.from(self.querySelectorAll("input[type='checkbox']")) : [])
    ;

    export function focusOnFirstElement() {
        if (listElements && listElements.length > 0) {
            listElements[0].focus();
        }
    }

    export function focusOnLastElement() {
        if (listElements && listElements.length > 0) {
            listElements[listElements.length - 1].focus();
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (listElements && listElements.length > 0) {
            const foundElement = listElements.find(
                element => element.value.toLowerCase().includes(value.toLowerCase())
            );
            if (foundElement) {
                foundElement.focus();
            }
        }
    }

    function handleComboKey(event, index) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();

            if (listElements.length > 0 && index < displayedItems.length - 1) {
                listElements[index + 1].focus();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (listElements.length > 0 && index > 0) {
                listElements[index - 1].focus();
            } else {
                focusOnOuterElement();
            }
        }

        Utils.sleep(5).then(() => {
            if (canExit(event, index)) {
                handleExit(event.key);
            }
        }).catch(console.error);
    }

    function handleKeyDown(event, index) {
        if (event.key.match(/^\w$/i)) {
            handlePrintableCharacter(event);
        } else {
            handleComboKey(event, index);
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === displayedItems.length - 1);
    }

    function handleChange(event, label, itemValue) {
        if (event.target.checked) {
            if (!selectedValues.includes(itemValue)) {
                selectedValues = [...selectedValues, itemValue];
                selectedLabels = [...selectedLabels, label];
            }
        } else {
            selectedValues = selectedValues.filter(v => v !== itemValue);
            selectedLabels = selectedLabels.filter(l => l !== label);
        }

        selectionCallback();
    }
</script>

<div class="qc-compact">
    {#if displayedItems.length > 0}
        <ul bind:this={self}>
            {#each displayedItems as item, index}
                <li class="qc-dropdown-list-multiple">
                    <Checkbox
                        bind:checked={item.checked}
                        value={item.value}
                        label={item.label}
                        {name}
                        disabled={item.disabled}
                        parentGroup="true"
                        dropdownListItem="true"
                        compact="true"
                        checkbox-onkeydown={(e) => handleKeyDown(e, index)}
                        handleChange={(e) => handleChange(e, item.label, item.value)}
                    />
                </li>
            {/each}
        </ul>
    {/if}
</div>
