<script>
    import Icon from "../../bases/Icon/Icon.svelte";

    let {
        variant = "primary",
        disabled = false,
        compact = false,
        rounded = false,
        label = "",
        icon = "",
        iconPosition = "left",
        iconSrc = "",
        ...rest
    } = $props();

    let className = $state();

    $effect(() => {
        className = [
            "qc-button",
            `qc-${variant}`,
            compact && "qc-compact",
            rounded && "qc-button-rounded"
        ].filter(Boolean).join(" ");
    });
</script>

<button
        class={className}
        disabled={disabled}
        {...rest}
>
    {#if iconPosition === "left"}
        {#if iconSrc}
            <Icon src={iconSrc} />
        {:else if icon}
            <Icon type={icon} />
        {/if}
    {/if}

    {label}

    {#if icon && iconPosition === "right"}
        {#if iconSrc}
            <Icon src={iconSrc} />
        {:else if icon}
            <Icon type={icon} />
        {/if}
    {/if}
</button>
