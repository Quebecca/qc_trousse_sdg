<svelte:options customElement="{{
    tag: 'qc-test',
    props: {
        foo: {attribute:'foo'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
  import Test from "./Test.svelte";
  let { foo } = $props();
</script>
<Test {foo}>
    {#snippet slot1()}
    <slot name="slot1"
             />
  {/snippet}
    {#snippet slot2()}
    <slot name="slot2"
             />
  {/snippet}
</Test>