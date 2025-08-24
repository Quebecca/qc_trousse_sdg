<script>
    let {
        forId,
        text,
        required = false,
        compact = false,
        bold = false,
        disabled = false,
        rootElement = $bindable(),
        ...rest
    } = $props();
</script>

<label
    bind:this={rootElement}
    for={forId}
    class={[
        "qc-label",
        compact && "qc-compact",
        bold && "qc-bold",
        disabled && "qc-disabled"
    ]}
    {...rest}
>
    {@html text}{#if required}<span class="qc-required" aria-hidden="true">*</span>{/if}
</label>
