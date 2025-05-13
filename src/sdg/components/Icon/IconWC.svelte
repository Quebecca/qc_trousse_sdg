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

    const props = $props();
</script>

<Icon {...props} />