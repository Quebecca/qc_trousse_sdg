<svelte:options customElement="{{
    tag: 'qc-radio-fieldset',
    shadow: 'none',
    props: {
        radioLegendName: {attribute:'radio-legend-name'},
        radioDescribedBy: {attribute: 'radio-described-by'}
    }
}}" />

<script>
    import RadioFieldset from "./RadioFieldset.svelte";

    let { radioLegendName, radioDescribedBy } = $props();
    const options = document.querySelectorAll("qc-radio-button");
</script>

<div>
    <RadioFieldset
        {radioLegendName}
        {radioDescribedBy}
        {options}
    />
</div>
