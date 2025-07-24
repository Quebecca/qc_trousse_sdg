<script>
    import {Utils} from "../../../utils";
    import Checkbox from "../../../Checkbox/Checkbox.svelte";

    let {
        items,
        handleExit = () => {},
        passValue = () => {},
        focusOnOuterElement = () => {}
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let
        selectedValues = [],
        selectedLabels = [],
        self = $state(),
        listElements = $derived(self.querySelectorAll("input[type='checkbox']"))
    ;

    export function focusOnFirstElement() {
        if (listElements.length > 0) {
            listElements[0].focus();
        }
    }

    function handleKeyDown(event, index) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();

            if (listElements.length > 0 && index < items.length - 1) {
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

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === items.length - 1);
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

        if (selectedValues.length > 2) {
            passValue(`${selectedValues.length} options sélectionnées`, selectedValues.join(", "));
        } else {
            passValue(selectedLabels.join(", "), selectedValues.join(", "));
        }
    }
</script>

<div class="qc-compact">
    {#if items.length > 0}
        <ul bind:this={self}>
            {#each items as item, index}
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
