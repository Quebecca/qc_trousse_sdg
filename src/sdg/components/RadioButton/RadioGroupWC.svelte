<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        radioLegend: {attribute:'radio-legend', type: 'String'},
        radioName: {attribute:'radio-name', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let { radioLegend, radioName, radioSize } = $props();
    const options = document.querySelectorAll("qc-radio-button");
</script>

<div>
    <RadioGroup
        {radioLegend}
        {radioName}
        {radioSize}
        {options}
    />
</div>
