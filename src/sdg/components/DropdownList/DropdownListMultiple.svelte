<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let {
        items,
        name,
    } = $props();
</script>

{#each items as item}
    <div class="qc-dropdown-list-multiple">
        <Checkbox
                value={item.value}
                label={item.label}
                {name}
                disabled={item.disabled}
                parentGroup="true"
        />
    </div>
{/each}
