<svelte:options customElement="{{
    tag: 'qc-icon',
    shadow: 'none',
    props: {
      type : {attribute: 'icon'},
      label: {attribute: 'label'},
      color: {attribute: 'label'},
      size: {attribute: 'size'},
      width: {attribute: 'width'},
      height: {attribute: 'height'}
  }
}}" />
<script>
    export let
        type,
        label,
        size='md',
        color = 'text-primary',
        width='auto',
        height='auto'
    ;
    $: attributes = width === "auto"
        ? {
            "data-img-size":size,
        }
        : {}
</script>
<div role="img"
     class="qc-icon"
     aria-label={label}
     style="--img-color:var(--qc-color-{color});
            --img-width:{width};
            --img-height:{height};
        "
     data-img-type={type}
     {...attributes}
     {...$$restProps}
    >
</div>
