<script>
    let {
        variant = "primary",
        type = "button",
        disabled = false,
        inverted = false,
        compact = false,
        rounded = false,
        label = "",
        ...rest
    } = $props();

    let className = $state();

    $effect(() => {
        className = [
            "qc-button",
            `qc-${variant}`,
            inverted && "inverted",
            compact && "qc-button-compact",
            rounded && "qc-button-rounded"
        ].filter(Boolean).join(" ");
    });
</script>

<button
        type={type}
        class={className}
        disabled={disabled}
        {...rest}
>
    {label}
</button>
