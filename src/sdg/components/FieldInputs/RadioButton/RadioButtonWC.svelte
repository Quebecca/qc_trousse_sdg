<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        name: {attribute:'name'},
        value: {attribute:'value'},
        size: {attribute:'size'},
        checked: {attribute: 'checked'},
        disabled: {attribute:'disabled'}
    }
}}" />

<script>
    import RadioButton from "./RadioButton.svelte";

    let { props } = $props();
</script>

<RadioButton {...props} />