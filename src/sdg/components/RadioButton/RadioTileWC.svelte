<svelte:options customElement="{{
    tag: 'qc-radio-tile',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        size: {attribute: 'size', type: 'String'},
        checked: {attribute: 'checked', type: 'String'},
        disabled: {attribute:'disabled', type: 'String'},
        required: {attribute: 'required', type: 'String'},
        invalid: {attribute: 'invalid', type: 'String'}
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
    import RadioTile from "./RadioTile.svelte";

    let {
        parent,
        name,
        value,
        label,
        size,
        checked,
        disabled,
        required,
        invalid,
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

<RadioTile
        name={parent?.name ?? name}
        {value}
        {label}
        size={parent?.size ?? size}
        {checked}
        {disabled}
        required={parent?.required ?? required}
        invalid={parent?.invalid ?? invalid}
        {...rest}
/>