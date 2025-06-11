<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        size: {attribute: 'size', type: 'String'},
        other: {attribute: 'other', type: 'String'},
        checked: {attribute: 'checked', type: 'String'},
        disabled: {attribute:'disabled', type: 'String'},
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
    import {onMount} from "svelte";

    let {
        parent,
        name,
        value,
        label,
        size,
        other,
        checked,
        disabled,
        ...rest
    } = $props();

    onMount(() => {
        if(other === "") {
            other = "true";
        }
        if (checked === "") {
            checked = "true";
        }
        if (disabled === "") {
            disabled = "true";
        }
    });
</script>

<RadioButton
    name={parent?.name ?? name}
    {value}
    {label}
    size={parent?.size ?? size}
    {other}
    {checked}
    {disabled}
    {...rest}
/>