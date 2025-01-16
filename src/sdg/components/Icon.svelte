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
     class="qc-icon"
     aria-label={label}
     data-img-size="{size}"
     style="--img-color:var(--qc-color-{color});"
     data-img-type={type}
     {...$$restProps}
    >
</div>
