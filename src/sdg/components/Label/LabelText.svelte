<script>
    let {text, required} = $props()
</script>

<span class="qc-label-text">{@html text}</span>{#if required}<span class="qc-required" aria-hidden="true">*</span>{/if}
