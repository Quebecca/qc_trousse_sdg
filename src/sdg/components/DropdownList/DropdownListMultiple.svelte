<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let {
        items,
        handleExit = () => {},
        passValue = () => {},
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let selectedValues = [],
        selectedLabels = [];

    function handleKeyDown(event, index) {
        if (canExit(event, index)) {
            handleExit();
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (event.key === "Tab" && index === items.length - 1);
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
        passValue(selectedLabels.join(", "), selectedValues.join(", "));
    }
</script>

{#each items as item, index}
    <div class="qc-dropdown-list-multiple">
        <Checkbox
            value={item.value}
            label={item.label}
            {name}
            disabled={item.disabled}
            parentGroup="true"
            checkbox-onkeydown={(e) => handleKeyDown(e, index)}
            checkbox-aria-role="option"
            handleChange={(e) => handleChange(e, item.label, item.value)}
        />
    </div>
{/each}
