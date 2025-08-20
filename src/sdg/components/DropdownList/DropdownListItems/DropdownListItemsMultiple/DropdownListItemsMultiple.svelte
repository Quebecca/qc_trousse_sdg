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
        )
    ;

    $effect(() => {
       console.log("displayedItems", displayedItems.map(item => item.element));
    });

    export function focusOnFirstElement() {
        if (displayedItems && displayedItems.length > 0) {
            if (displayedItems[0].disabled) {
                displayedItems[0].element.closest("li").focus();
            } else {
                displayedItems[0].element.focus();
            }
        }
    }

    export function focusOnLastElement() {
        if (displayedItems && displayedItems.length > 0) {
            if (displayedItems[displayedItems.length - 1].disabled) {
                displayedItems[displayedItems.length - 1].element.closest("li").focus();
            } else {
                displayedItems[displayedItems.length - 1].element.focus();
            }
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (displayedItems && displayedItems.length > 0) {
            const foundElement = displayedItems.find(
                element => element.value.toLowerCase().includes(value.toLowerCase())
            ).element;
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
                    displayedItems[index + 1].element.closest("li").focus();
                } else {
                    displayedItems[index + 1].element.focus();
                }
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (displayedItems.length > 0 && index > 0) {
                if (displayedItems[index - 1].disabled) {
                    displayedItems[index - 1].element.closest("li").focus();
                } else {
                    displayedItems[index - 1].element.focus();
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
    <ul bind:this={self}>
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
                <Checkbox
                    bind:checked={item.checked}
                    bind:this={displayedItems[index].element}
                    value={item.value}
                    label={item.label}
                    {name}
                    disabled={item.disabled}
                    parentGroup="true"
                    dropdownListItem="true"
                    compact="true"
                    checkbox-onkeydown={(e) => handleKeyDown(e, index)}
                    onchange={(e) => handleChange(e, item.label, item.value)}
                />
            </li>
        {/each}
    </ul>
{/if}
