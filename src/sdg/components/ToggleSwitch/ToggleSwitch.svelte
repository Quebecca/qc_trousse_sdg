<script>
    let {
        label,
        id,
        checked = $bindable(false),
        disabled = $bindable(false),
        justified,
        textAlign
    } = $props();

    const usedId = "toggle-switch-" + (id ?
        id : Math.random().toString(36));

    let usedLabelTextAlignment = $derived(textAlign?.toLowerCase() === "end" ? "end" : "start");
</script>

<label class={["qc-switch", justified && "qc-switch-justified"]} for={usedId}>
    <input
        id={usedId}
        type="checkbox"
        role="switch"
        bind:checked={checked}
        {disabled}
    />

    <span class={["qc-switch-label", usedLabelTextAlignment === "end" && "qc-switch-label-end"]}>{@html label}</span>
    <span class="qc-switch-slider"></span>
</label>