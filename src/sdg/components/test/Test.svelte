<script>
    export let foo;
</script>
<div class="root">
    <label>Test.svelte</label>
<slot name="slot1"/>
    <div>--</div>
<slot name="slot2">{foo}</slot>
</div>
<style>
    .root {
        border: 1px solid blue;
        padding: 10px;
    }
</style>

