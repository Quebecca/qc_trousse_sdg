<svelte:options customElement="{{
    tag: 'qc-radio-fieldset',
    props: {
        fieldLegendName: {attribute:'field-legend-name'},
        fieldDescribedBy: {attribute: 'field-described-by'}
    }
}}" />

<script>
    import RadioFieldset from "./RadioFieldset.svelte";

    let { fieldLegendName, fieldDescribedBy } = $props();
</script>

{#snippet options()}
    {@const contentHtml = `<slot />`}
    {@html contentHtml}
{/snippet}

<div>
    <RadioFieldset
        {fieldLegendName}
        {fieldDescribedBy}
        {options}
    />
</div>
