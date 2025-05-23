<svelte:options customElement="{{
    tag: 'qc-fieldset',
    props: {
        fieldLegendName: {attribute:'field-legend-name'},
        fieldDescribedBy: {attribute: 'field-described-by'}
    }
}}" />

<script>
    import Fieldset from "./Fieldset.svelte";

    let { fieldLegendName, fieldDescribedBy } = $props();
</script>

{#snippet options()}
    {@const contentHtml = `<slot />`}
    {@html contentHtml}
{/snippet}

<div>
    <Fieldset
        {fieldLegendName}
        {fieldDescribedBy}
        {options}
    />
</div>
