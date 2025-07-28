<svelte:options customElement={{
  tag: 'qc-button',
  shadow: 'none',
  props: {
    variant: { attribute: 'variant', type: 'String' },
    disabled: { attribute: 'disabled', type: 'Boolean' },
    compact: { attribute: 'compact', type: 'Boolean' },
    rounded: { attribute: 'rounded', type: 'Boolean' },
    label: { attribute: 'label', type: 'String' }
  }
}} />

<script>
    import Button from './Button.svelte';

    let {
        variant = "primary",
        disabled = false,
        compact = false,
        rounded = false,
        label = "",
        ...rest
    } = $props();
</script>

<Button
        {variant}
        {disabled}
        {compact}
        {rounded}
        {label}
        {...rest}
/>
