<svelte:options customElement="{{
    tag: 'qc-icon',
    shadow: 'none',
    props: {
      type : {attribute: 'icon'},
      label: {attribute: 'label'},
      color: {attribute: 'label'},
      size: {attribute: 'size'}
  }
}}" />
<script>
    export let
        type,
        label,
        size='md',
        color = 'text-primary'
    ;
</script>
<div role="img"
     aria-label={label}
     data-img-size="{size}"
     style="--img-color:var(--qc-color-{color});"
     data-img-type={type}
    >
</div>
<style lang="scss">
    [role=img] {
      display: inline-block;
      @each $size-type, $size in (xs: 12, sm: 16, md: 20, nm: 24, lg: 28, xl: 32) {
        &[data-img-size=#{$size-type}] {
          height: rem($size);
          width: rem($size);
        }
      }
      background-color: var(--img-color);
      @each $name, $url in $images {
        &[data-img-type=#{$name}] {
          mask: getImageUrl($name) no-repeat;
          mask-size: 100% 100%;
        }
      }
    }
</style>