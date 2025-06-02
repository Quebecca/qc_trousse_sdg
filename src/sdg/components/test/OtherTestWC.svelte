<svelte:options customElement="{{
    tag: 'qc-other-test',
    props: {
        foo: {attribute:'foo'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
    import Outer from "./Outer.svelte";
    let { foo } = $props();
</script>
<div class="root">
    <label>OtherTest.svelte</label>
<Outer>
    {#snippet slot1()}
                <p >slot1</p>
            {/snippet}
    {#snippet slot2()}
                <p >slot2</p>
            {/snippet}
</Outer>
</div>
<style>
    .root {
        border: 1px solid green;
        padding: 10px;
    }
</style>