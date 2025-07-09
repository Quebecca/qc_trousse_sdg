<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let {
        items,
        value = $bindable(""),
        handleExit = () => {}
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);
    function handleKeyDown(event, index) {
        if (canExit(event, index)) {
            handleExit();
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (event.key === "Tab" && index === items.length - 1);
    }

    function handleChange(event) {
        console.log(event.target.checked);
    }

    function pushValue(v) {
        if (value.indexOf(v) === -1) {
            value.push(v);
        }
    }

    function removeValue(v) {
        const valueIndex = value.indexOf(v);

        if (valueIndex !== -1) {
            value.splice(valueIndex, 1);
        }
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
                onchange={(e) => {
                    handleChange(e);
                    if (e.target.checked) {
                        pushValue(item.value);
                    } else {
                        removeValue(item.value);
                    }
                }}
        />
    </div>
{/each}
