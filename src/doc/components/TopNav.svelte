<svelte:options customElement="{{
    tag: 'qc-doc-top-nav'
  , props: {

  }
}}" />
<script>
    import Switch from "./Switch.svelte";
    let value = localStorage.getItem('dark-theme') === "true";

    $: document.documentElement.classList.toggle('qc-dark-theme', value)
    $: localStorage.setItem('dark-theme', value)
</script>
<div role="complementary">
    <div class="qc-container">
        <div class="switch-control">
            <label for="switch">Activer le thème sombre</label>
            <Switch id="switch" bind:value />
        </div>
    </div>
</div>
<style lang="scss">
  * {
    box-sizing: border-box;
  }

  [role=complementary] {
    background-color: token-value(color blue medium);
    color: token-value(color grey pale);
    min-height: rem(72);
    height: rem(72);
  }

  .qc-container
  {
    display: flex;
    width: 100%;
    height: 100%;
    padding-right: calc(1 * var(--qc-grid-gutter) / 2);
    padding-left: calc(1 * var(--qc-grid-gutter) / 2);
    margin-right: auto;
    margin-left: auto;
    align-items: center;
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
  label {
    font-weight: bold;
  }

  @each $breakpoint, $media-width in map-get($xl-tokens, grid, breakpoint) {
    @media (min-width: $media-width) {
      .qc-container {
        max-width: map-get($xl-tokens, grid, container-max-width, $breakpoint);
      }
    }
  }

</style>
