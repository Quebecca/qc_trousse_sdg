<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        legend: {attribute:'legend', type: 'String'},
        radioName: {attribute:'radio-name', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
        radioRequired: {attribute: 'radio-required', type: 'String'}
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let {
        legend,
        radioName,
        radioSize,
        radioRequired = true
    } = $props();
    const options = document.querySelectorAll(`qc-radio-button[radio-name=${radioName}]`);
</script>

<RadioGroup
    {legend}
    {radioSize}
    {options}
    {radioRequired}
/>

