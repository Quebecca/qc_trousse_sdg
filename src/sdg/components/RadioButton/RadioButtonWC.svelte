<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        radioName: {attribute:'radio-name'},
        radioValue: {attribute:'radio-value'},
        radioSize: {attribute:'radio-size'},
        radioChecked: {attribute: 'radio-checked'},
        radioDisabled: {attribute:'radio-disabled'},
        radioRequired: {attribute:'radio-required'}
    }
}}" />

<script>
    import RadioButton from "./RadioButton.svelte";

    let { props } = $props();
</script>

<RadioButton {...props} />