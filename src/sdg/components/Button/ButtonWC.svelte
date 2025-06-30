<svelte:options customElement="{{
    tag: 'qc-button',
    shadow: 'none',
    props: {
        variant: {attribute: 'variant', type: 'String'},
        size: {attribute: 'size', type: 'String'},
        type: {attribute: 'type', type: 'String'},
        disabled: {attribute: 'disabled', type: 'Boolean'}
    }
}}" />

<script>
    import Button from "./Button.svelte";

    let {
        variant = "primary",
        size,
        type = "button", 
        disabled = false,
        ...rest
    } = $props();
</script>

<Button
    {variant}
    {size}
    {type}
    {disabled}
    {...rest}
>
    <slot></slot>
</Button>