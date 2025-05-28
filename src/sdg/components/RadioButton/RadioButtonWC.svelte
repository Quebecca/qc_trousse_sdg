<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        radioName: {attribute:'radio-name', type: 'String'},
        radioValue: {attribute:'radio-value', type: 'String'},
        radioSize: {attribute:'radio-size', type: 'String'},
        radioChecked: {attribute: 'radio-checked', type: 'Boolean'},
        radioDisabled: {attribute:'radio-disabled', type: 'Boolean'},
        radioRequired: {attribute:'radio-required', type: 'Boolean'}
    }
}}" />

<script>
    import RadioButton from "./RadioButton.svelte";

    let { props } = $props();
</script>

<RadioButton {...props} />