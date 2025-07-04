<script>
    let {
        label,
        checked = $bindable(false),
        disabled = $bindable(false),
        justify = false,
    } = $props();

    const generatedId = label.replace(/\s/g, '-').toLowerCase() + '-' + Math.random().toString(36);
</script>

<label class={["qc-switch", justify && "qc-switch-justify"]} for="{generatedId}">
    <input
        id={generatedId}
        type="checkbox"
        role="switch"
        bind:checked={checked}
        aria-checked={checked}
        {disabled}
    />
    <span class="qc-switch-label">{@html label}</span>
    <span class="qc-switch-slider"></span>
</label>