<script>
    let {
        fieldLegendName = "",
        fieldDescribedBy = "",
        options
    } = $props();
</script>

<fieldset aria-describedby={fieldDescribedBy}>
    {#if fieldLegendName}
        <legend>{fieldLegendName}</legend>
    {/if}


    <div>
        {@render options?.()}
    </div>
</fieldset>