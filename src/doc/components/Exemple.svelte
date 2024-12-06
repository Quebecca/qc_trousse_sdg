<svelte:options customElement="{{
    tag: 'qc-doc-figure',
}}" />
<figure {...$$restProps}>
    <slot/>
</figure>
<style>
    :host {
        display:block;
    }
    figure {
      display:block;
      margin:0;
        padding:0;
    }
</style>
