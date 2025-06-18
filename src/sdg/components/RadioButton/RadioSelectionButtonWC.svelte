<svelte:options customElement="{{
    tag: 'qc-radio-selection-button',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        size: {attribute: 'size', type: 'String'},
        checked: {attribute: 'checked', type: 'String'},
        disabled: {attribute:'disabled', type: 'String'},
        required: {attribute: 'required', type: 'String'},
        invalid: {attribute: 'invalid', type: 'String'},
        description: {attribute: 'descirption', type: 'String'}
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
    import RadioSelectionButton from "./RadioSelectionButton.svelte";

    let {
        parent,
        name,
        value,
        label,
        checked,
        disabled,
        required,
        invalid,
        description,
        ...rest
    } = $props();

    if (checked === "") {
        checked = "true";
    }
    if (disabled === "") {
        disabled = "true";
    }
    if (required === "") {
        required = "true";
    }
    if (invalid === "") {
        invalid = "true";
    }
</script>

<RadioSelectionButton
        name={parent?.name ?? name}
        {value}
        {label}
        {checked}
        {disabled}
        required={parent?.required ?? required}
        invalid={parent?.invalid ?? invalid}
        {description}
        {...rest}
/>