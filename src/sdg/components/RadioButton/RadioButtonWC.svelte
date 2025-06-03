<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        radioValue: {attribute:'radio-value', type: 'String'},
        radioLabel: {attribute:'radio-label', type: 'String'},
        radioChecked: {attribute: 'radio-checked', type: 'Boolean'},
        radioDisabled: {attribute:'radio-disabled', type: 'Boolean'},
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static parent;
            static thisElement;
            constructor() {
                super();

                this.thisElement = this;
                this.parent = this.closest('qc-radio-group');
            }
        }
    }
}}" />

<script>
    import RadioButton from "./RadioButton.svelte";

    let {
        parent,
        radioName,
        radioValue,
        radioLabel,
        radioSize,
        radioChecked,
        radioDisabled,
        radioRequired
    } = $props();
</script>

<RadioButton
    radioName={parent?.radioName ?? radioName}
    {radioValue}
    {radioLabel}
    radioSize={parent?.radioSize ?? radioSize}
    {radioChecked}
    {radioDisabled}
    radioRequired={parent?.radioRequired ?? radioRequired}
/>