<svelte:options customElement="{{
    tag: 'qc-other-test',
    props: {
        foo: {attribute:'foo'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
    import Test from "./Test.svelte";
    export let foo;
</script>
<div class="root">
    <label>OtherTest.svelte</label>
<Test>
    <p slot="slot1">slot1</p>
    <p slot="slot2">slot2</p>
</Test>
</div>
<style>
    .root {
        border: 1px solid green;
        padding: 10px;
    }
</style>