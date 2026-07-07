<svelte:options customElement="{{
    tag: 'qc-icon',
    shadow: 'none',
    props: {
      type : {attribute: 'icon'},
      label: {attribute: 'label'},
      color: {attribute: 'color'},
      size: {attribute: 'size'},
      width: {attribute: 'width'},
      height: {attribute: 'height'},
      src: {attribute: 'src'},
      rotate: {attribute: 'rotate'},
      variant: {attribute: 'variant'},
      renderMode: {attribute: 'render-mode'},
      useMaterial: {attribute: 'use-material', type: 'Boolean'},
      codepoint: {attribute: 'codepoint'},
  }
}}" />

<script>
    import Icon from "./Icon.svelte";

    let { useMaterial, ...otherProps } = $props();
</script>

<Icon use-material={useMaterial} {...otherProps} />