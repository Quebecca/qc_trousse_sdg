<svelte:options customElement="{{
    tag: 'qc-test',
    props: {
        foo: {attribute:'foo'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
  import Test from "./Test.svelte";
  export let foo;
</script>
<Test {foo}>
    <slot name="slot1"
          slot="slot1" />
    <slot name="slot2"
          slot="slot2" />
</Test>