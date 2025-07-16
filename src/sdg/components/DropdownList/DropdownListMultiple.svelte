<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let {
        items,
        noOptionsMessage,
        handleExit = () => {},
        passValue = () => {},
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let selectedValues = [],
        selectedLabels = [];

    function handleKeyDown(event, index) {
        if (canExit(event, index)) {
            handleExit(event.key);
        }
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
        {#each items as item, index}
            <div class="qc-dropdown-list-multiple">
                <Checkbox
                    bind:checked={item.checked}
                    value={item.value}
                    label={item.label}
                    {name}
                    disabled={item.disabled}
                    parentGroup="true"
                    compact="true"
                    checkbox-onkeydown={(e) => handleKeyDown(e, index)}
                    handleChange={(e) => handleChange(e, item.label, item.value)}
                />
            </div>
        {/each}
    {:else}
        <div class="qc-dropdown-list-no-options">{noOptionsMessage}</div>
    {/if}
</div>
