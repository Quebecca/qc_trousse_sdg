<svelte:options customElement={{
  tag: 'qc-button',
  shadow: 'none',
  props: {
    variant: { attribute: 'variant', type: 'String' },
    size: { attribute: 'size', type: 'String' },
    type: { attribute: 'type', type: 'String' },
    disabled: { attribute: 'disabled', type: 'Boolean' },
    inverted: { attribute: 'inverted', type: 'Boolean' },
    compact: { attribute: 'compact', type: 'Boolean' },
    rounded: { attribute: 'rounded', type: 'Boolean' },
    label: { attribute: 'label', type: 'String' }
  }
}} />

<script>
    import Button from './Button.svelte';

    let {
        variant = "primary",
        size,
        type = "button",
        disabled = false,
        inverted = false,
        compact = false,
        rounded = false,
        label = "",
        ...rest
    } = $props();
</script>

<Button
        {variant}
        {size}
        {type}
        {disabled}
        {inverted}
        {compact}
        {rounded}
        {label}
        {...rest}
/>
