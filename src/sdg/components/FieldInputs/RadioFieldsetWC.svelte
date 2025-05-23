<svelte:options customElement="{{
    tag: 'qc-radio-fieldset',
    shadow: 'none',
    props: {
        fieldLegendName: {attribute:'field-legend-name'},
        fieldDescribedBy: {attribute: 'field-described-by'}
    }
}}" />

<script>
    import RadioFieldset from "./RadioFieldset.svelte";

    let { fieldLegendName, fieldDescribedBy } = $props();
    const options = document.querySelectorAll("qc-radio-button");
</script>

<div>
    <RadioFieldset
        {fieldLegendName}
        {fieldDescribedBy}
        {options}
    />
</div>
