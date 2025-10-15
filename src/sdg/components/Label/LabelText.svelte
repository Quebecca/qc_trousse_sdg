<script>
    let {text, required} = $props()
</script>
{@html text}{#if required}<span class="qc-required" aria-hidden="true">*</span>{/if}