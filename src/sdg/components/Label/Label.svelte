<script>
    let {
        forId,
        text,
        required = false,
        compact = false,
        disabled = false,
        bold = false
    } = $props();
</script>

<label
    for={forId}
    class={[
        "qc-label",
        compact && "qc-label-compact",
        disabled && "qc-disabled",
        bold && "qc-label-bold"
  ]}
>
    {@html text}
    {#if required}
        <span class="qc-required" aria-hidden="true">*</span>
    {/if}
</label>
