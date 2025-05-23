<svelte:options customElement="{{
    tag: 'qc-fieldset',
    shadow: 'none',
    props: {
        fieldInputType: {attribute:'field-input-type'},
        fieldLegendName: {attribute:'field-legend-name'},
        fieldValues: {attribute:'field-values'},
        fieldName: {attribute:'field-name'},
        fieldDescribedBy: {attribute: 'field-described-by'}
    }
}}" />

<script>
    import RadioButton from "./RadioButton/RadioButton.svelte";

    let {
        fieldInputType = "radio",
        fieldLegendName = "",
        fieldValues = $bindable([]),
        fieldName = "",
        fieldDescribedBy = "",
    } = $props();

    let valuesArray = $derived(JSON.parse(fieldValues.replace(/'/g, '"')));
</script>

<fieldset aria-describedby={fieldDescribedBy}>
    {#if fieldLegendName}
        <legend>{fieldLegendName}</legend>
    {/if}


    {#if fieldInputType === "radio"}
        {#each valuesArray as v}
            <RadioButton
                    name={fieldName}
                    value={v}
            />
        {/each}
    {/if}
</fieldset>