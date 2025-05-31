<script>
    let { foo, slot1, slot2 } = $props();
</script>
<div class="root">
    <label>Test.svelte</label>
{@render slot1?.()}
    <div>--</div>
{#if slot2}{@render slot2()}{:else}{foo}{/if}
</div>
<style>
    .root {
        border: 1px solid blue;
        padding: 10px;
    }
</style>

