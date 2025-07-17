<script>
    let {
        label,
        checked = $bindable(false),
        disabled = $bindable(false),
        labelPosition = "left",
    } = $props();

    const generatedId = label.replace(/\s/g, '-').toLowerCase() + '-' + Math.random().toString(36);
    const usedLabelPosition = labelPosition.toLowerCase() === "right" ? "right" : "left";
</script>

<label class={[
        "qc-switch",
        usedLabelPosition === "left" && "qc-switch-label-left"
    ]}
    for="{generatedId}"
>
    <input
            id={generatedId}
            type="checkbox"
            role="switch"
            bind:checked={checked}
            aria-checked={checked}
            {disabled}
    />
    {#if usedLabelPosition === "right"}
        <span class="qc-switch-slider"></span>
        <span class="qc-switch-label">{@html label}</span>
    {:else}
        <span class="qc-switch-label">{@html label}</span>
        <span class="qc-switch-slider"></span>
    {/if}
</label>