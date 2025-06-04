<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        size: {attribute: 'size', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        required: {attribute: 'required', type: 'String'},
        hasError: {attribute: 'has-error', type: 'Boolean'}
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
        name,
        value,
        label,
        size,
        checked,
        disabled,
        required,
        hasError
    } = $props();
</script>

<RadioButton
    name={parent?.name ?? name}
    {value}
    {label}
    size={parent?.size ?? size}
    {checked}
    {disabled}
    required={parent?.required ?? required}
    hasError={parent?.hasError ?? hasError}
/>