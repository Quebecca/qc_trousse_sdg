<script>
    import { setContext } from 'svelte';
    let {shared, inners, slot } = $props();
    setContext('shared', {shared});
</script>
<div class="root">
    <strong>Outer.svelte</strong>
    {#if inners}
        {#each inners as inner,i}
            {@render slot(inner)}
        {/each}
    {/if}
</div>
<style>
    .root {
        border: 1px solid blue;
        padding: 10px;
    }
</style>

