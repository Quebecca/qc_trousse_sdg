<script>
    let {
        variant = "primary",
        disabled = false,
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
            compact && "qc-button-compact",
            rounded && "qc-button-rounded"
        ].filter(Boolean).join(" ");
    });
</script>

<button
        class={className}
        disabled={disabled}
        {...rest}
>
    {label}
</button>
