<script>
    import Checkbox from "../Checkbox/Checkbox.svelte";

    let { items, name, value = $bindable("") } = $props();
</script>

{#each items as item}
    <div class="qc-dropdown-list-multiple">
        <Checkbox
                bind:group={value}
                value={item.value}
                label={item.label}
                {name}
                disabled={item.disabled}
                parentGroup="true"
        />
    </div>
{/each}
