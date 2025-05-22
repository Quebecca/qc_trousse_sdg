<script>
    let {
        type,
        label,
        size = 'md',
        color = 'text-primary',
        width='auto',
        height='auto',
        ...rest
    } = $props();

    let attributes = $derived(width === 'auto' ? { 'data-img-size': size } : {});
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
     {...rest}
    >
</div>
