<svelte:options customElement="{{
    tag: 'qc-icon',
    shadow: 'none',
    props: {
      type : {attribute: 'icon'},
      label: {attribute: 'label'},
      color: {attribute: 'color'},
      size: {attribute: 'size'},
      width: {attribute: 'width'},
      height: {attribute: 'height'}
  }
}}" />

<script>
    import Icon from "./Icon.svelte";

    let {
        type,
        label,
        size = 'md',
        color = 'text-primary',
        width='auto',
        height='auto',
        ...rest
    } = $props();
</script>

<Icon
    {type}
    {label}
    {size}
    {color}
    {width}
    {height}
    {...rest}
></Icon>