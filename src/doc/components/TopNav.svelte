<svelte:options customElement="{{
    tag: 'qc-doc-top-nav',
    shadow: 'none',
   props: {

  }
}}" />
<script>
  import { run } from 'svelte/legacy';

    import Switch from "./Switch.svelte";
    let value = $state(localStorage.getItem('dark-theme') === "true");

    run(() => {
    document.documentElement.classList.toggle('qc-dark-theme', value)
  });
    run(() => {
    localStorage.setItem('dark-theme', value)
  });
</script>
<div role="complementary">
    <div class="qc-container top-nav">
        <div class="switch-control">
            <label for="switch">Activer le thème sombre</label>
            <Switch id="switch" bind:value />
        </div>
    </div>
</div>
<style lang="scss">

  [role=complementary] {
    position: sticky;
    z-index: 100;
    top: 0;
    background-color: token-value(color blue medium);
    color: token-value(color grey pale);
    min-height: rem(72);
    height: rem(72);
  }
  .top-nav {
    position: absolute;
    inset: 0;
    display: flex;

    align-items: end;
    padding-bottom: token-value(spacer sm);
    .switch-control {
      margin-left: auto;
      margin-right: 0;
      display: flex;
      align-items: center;
      label:first-child {
        margin-right: rem(16);
      }
    }
  }


</style>
