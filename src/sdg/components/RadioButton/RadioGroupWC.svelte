<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        size: {attribute:'size', type: 'String'},
        required: {attribute: 'required', type: 'String'},
        invalid: {attribute: 'invalid', type: 'String'},
        invalidText: {attribute: 'invalid-text', type: 'String'}
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static radioButtons;

            constructor() {
                super();
                this.radioButtons = Array.from(this.querySelectorAll('qc-radio-button'));
                this.radioButtons.push(...Array.from(this.querySelectorAll('qc-radio-tile')));
            }
        }
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

    let {
        name,
        legend,
        size = "md",
        radioButtons,
        required,
        invalid,
        invalidText
    } = $props();

    if (required === "") {
        required = "true";
    }
    if (invalid === "") {
        invalid = "true";
    }
</script>

<RadioGroup
    {name}
    {legend}
    {size}
    {radioButtons}
    {required}
    {invalid}
    {invalidText}
/>

