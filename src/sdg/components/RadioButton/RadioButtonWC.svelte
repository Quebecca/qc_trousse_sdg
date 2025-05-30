<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        radioName: {attribute:'radio-name', type: 'String'},
        radioValue: {attribute:'radio-value', type: 'String'},
        radioLabel: {attribute:'radio-label', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
        radioChecked: {attribute: 'radio-checked', type: 'Boolean'},
        radioDisabled: {attribute:'radio-disabled', type: 'Boolean'},
        radioRequired: {attribute:'radio-required', type: 'Boolean'}
    }
}}" />

<script>
    import RadioButton from "./RadioButton.svelte";

    let {
        radioName,
        radioValue,
        radioLabel,
        radioSize,
        radioChecked = false,
        radioDisabled,
        radioRequired = true
    } = $props();
</script>

<RadioButton
    {radioName}
    {radioValue}
    {radioLabel}
    {radioSize}
    {radioChecked}
    {radioDisabled}
    {radioRequired}
/>