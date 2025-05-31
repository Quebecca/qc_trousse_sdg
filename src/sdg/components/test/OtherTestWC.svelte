<svelte:options customElement="{{
    tag: 'qc-other-test',
    props: {
        foo: {attribute:'foo'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
    import Test from "./Test.svelte";
    let { foo } = $props();
</script>
<div class="root">
    <label>OtherTest.svelte</label>
<Test>
    {#snippet slot1()}
                <p >slot1</p>
            {/snippet}
    {#snippet slot2()}
                <p >slot2</p>
            {/snippet}
</Test>
</div>
<style>
    .root {
        border: 1px solid green;
        padding: 10px;
    }
</style>