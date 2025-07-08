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
</script>

{#each items as item, index}
    <div class="qc-dropdown-list-multiple">
        <Checkbox
                bind:group={value}
                value={item.value}
                label={item.label}
                {name}
                disabled={item.disabled}
                parentGroup="true"
                checkbox-onkeydown={(e) => handleKeyDown(e, index)}
                checkbox-aria-role="option"
        />
    </div>
{/each}
