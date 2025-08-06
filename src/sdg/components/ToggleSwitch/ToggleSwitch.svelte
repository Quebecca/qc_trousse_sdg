<script>
    let {
        label,
        id,
        checked = $bindable(false),
        disabled = $bindable(false),
        justified
    } = $props();

    const usedId = "toggle-switch-" + (id ?
        id : Math.random().toString(36));
</script>

<label class={["qc-switch", justified && "qc-switch-justified"]} for={usedId}>
    <input
        id={usedId}
        type="checkbox"
        role="switch"
        bind:checked={checked}
        {disabled}
    />

    <span class="qc-switch-label">{@html label}</span>
    <span class="qc-switch-slider"></span>
</label>