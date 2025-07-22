<script>
    let {
        label,
        id,
        checked = $bindable(false),
        disabled = $bindable(false),
        labelPosition = "left",
    } = $props();

    const usedId = "inpupt-" + (id ?
        id : Math.random().toString(36));
    const usedLabelPosition = labelPosition.toLowerCase() === "right" ? "right" : "left";

    $inspect("ToggleSwitch svelte ", checked)
</script>

<label class={[
        "qc-switch",
        usedLabelPosition === "left" && "qc-switch-label-left"
    ]}
    for={usedId}
>
    <input
            id={usedId}
            type="checkbox"
            role="switch"
            bind:checked={checked}
            {disabled}
    />
    {#if usedLabelPosition === "left"}
        <span class="qc-switch-label">{@html label}</span>
        <span class="qc-switch-slider"></span>
    {:else}
        <span class="qc-switch-slider"></span>
        <span class="qc-switch-label">{@html label}</span>
    {/if}
</label>