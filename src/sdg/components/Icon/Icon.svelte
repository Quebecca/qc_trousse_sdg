<script>
    let {
        type,
        label,
        size = 'md',
        color = 'text-primary',
        width='auto',
        height='auto',
        src='',
        rotate = 0,
        ...rest
    } = $props();
    let attributes = $derived(width === 'auto' ? { 'data-img-size': size } : {});
</script>

<div role="img"
     class={[
         "qc-icon",
         src && "qc-icon-custom"
     ]}
     aria-label={label}
     style={`--img-color: var(--qc-color-${color});
        --img-width: ${width};
        --img-height: ${height};
        --img-src: url('${src}');
    `}
     style:--img-rotate={rotate && rotate + "deg"}

     data-img-type={type}
     {...attributes}
     {...rest}
    >
</div>
