<svelte:options customElement="{{
    tag: 'qc-radio-fieldset',
    shadow: 'none',
    props: {
        radioLegend: {attribute:'radio-legend', type: 'String'},
        radioName: {attribute:'radio-name', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
    }
}}" />

<script>
    import RadioFieldset from "./RadioFieldset.svelte";

    let { radioLegend, radioName, radioSize } = $props();
    const options = document.querySelectorAll("qc-radio-button");
</script>

<div>
    <RadioFieldset
        {radioLegend}
        {radioName}
        {radioSize}
        {options}
    />
</div>
