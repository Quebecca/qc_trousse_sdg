<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let { items, value = $bindable(""), handleExitTab = () => {} } = $props();

    const name = Math.random().toString(36).substring(2, 15);
    function handleKeyDown(event, index) {
        if (event.key === "Tab" && index === items.length - 1) {
            handleExitTab();
        }
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
