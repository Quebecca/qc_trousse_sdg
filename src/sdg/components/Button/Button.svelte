<script>
    import Icon from "../../components/Icon/Icon.svelte";

    let {
        variant = "primary",
        disabled = false,
        compact = false,
        rounded = false,
        label = "",
        icon = "",
        iconPosition = "left",
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
    {#if icon && iconPosition === "left"}
        <Icon type={icon} />
    {/if}

    {label}

    {#if icon && iconPosition === "right"}
        <Icon type={icon} />
    {/if}
</button>
