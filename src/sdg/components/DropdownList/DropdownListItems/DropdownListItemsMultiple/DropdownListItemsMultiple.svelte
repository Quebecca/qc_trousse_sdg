<script>
    import {Utils} from "../../../utils";

    let {
        displayedItems,
        handleExit = () => {},
        selectionCallback = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {}
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let displayedItemsElements = $state(new Array(displayedItems.length));

    export function focusOnFirstElement() {
        if (displayedItems && displayedItems.length > 0) {
            if (displayedItems[0].disabled) {
                displayedItemsElements[0].closest("li").focus();
            } else {
                displayedItemsElements[0].focus();
            }
        }
    }

    export function focusOnLastElement() {
        if (displayedItems && displayedItems.length > 0) {
            if (displayedItems[displayedItems.length - 1].disabled) {
                displayedItemsElements[displayedItemsElements.length - 1].closest("li").focus();
            } else {
                displayedItemsElements[displayedItemsElements.length - 1].focus();
            }
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (displayedItemsElements && displayedItemsElements.length > 0) {
            const foundElement = displayedItemsElements.find(
                element => element.value.toLowerCase().includes(value.toLowerCase())
            );
            if (foundElement) {
                if (foundElement.disabled) {
                    foundElement.closest("li").focus();
                } else {
                    foundElement.focus();
                }
            }
        }
    }

    function handleComboKey(event, index) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItems.length > 0 && index < displayedItems.length - 1) {
                if (displayedItems[index + 1].disabled) {
                    displayedItemsElements[index + 1].closest("li").focus();
                } else {
                    displayedItemsElements[index + 1].focus();
                }
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItems.length > 0 && index > 0) {
                if (displayedItems[index - 1].disabled) {
                    displayedItemsElements[index - 1].closest("li").focus();
                } else {
                    displayedItemsElements[index - 1].focus();
                }
            } else {
                focusOnOuterElement();
            }
        }

        if (event.key === "Enter") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItems.length > 0 && !displayedItems[index].disabled) {
                event.target.checked = !event.target.checked;
                displayedItems[index].checked = event.target.checked;
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

    function handleLiKeyDown(event, index) {
        if (event.target.tagName !== "INPUT") {
            handleKeyDown(event, index);

            if (event.key !== "Tab") {
                event.preventDefault();
                event.stopPropagation();
            }
        }
    }

    function handleLiClick(event, item) {
        if (event.target.tagName !== "INPUT") {
            event.preventDefault();
            event.stopPropagation();

            if (!item.disabled) {
                item.checked = !item.checked;
            }
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === displayedItems.length - 1);
    }

    function handleChange() {
        selectionCallback();
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
            <!-- svelte-ignore a11y_no_noninteractive_tabindex -->
            <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
            <!-- Pour conserver la navigation d'un élément <select>, le focus doit pouvoir se faire sur les éléments
             <li> dont le <Checkbox> interne est disabled.-->
            <li
                class={[
                    "qc-dropdown-list-multiple",
                    item.disabled ? "qc-disabled" : "qc-dropdown-list-active"
                ]}
                tabindex={item.disabled ? "0" : "-1"}
                onkeydown={(e) => handleLiKeyDown(e, index)}
                onclick={(e) => handleLiClick(e, item)}
            >

                <label
                        class="qc-dropdown-list-checkbox"
                        compact
                        for={item.id + "-checkbox"}
                >
                    <input
                            id={item.id + "-checkbox"}
                            type="checkbox"
                            class="qc-choicefield qc-compact"
                            value={item.value}
                            {name}
                            disabled={item.disabled}
                            bind:checked={item.checked}
                            bind:this={displayedItemsElements[index]}
                            onchange={handleChange}
                            onkeydown={(e) => handleKeyDown(e, index)}
                    />
                    <span>{item.label}</span>
                </label>
            </li>
        {/each}
    </ul>
{/if}
