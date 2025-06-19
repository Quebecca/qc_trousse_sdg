<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'}
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
        checked = $bindable(false),
        disabled,
        required = $bindable(false),
        invalid = $bindable(false),
        // groupValue= $bindable(""),
        ...rest
    } = $props();
    let Component = RadioButton
    $effect(() => {
        if(checked) {
            parent.value = value;
        }
    })

</script>
{#if parent}
<Component
    name={parent.name}
    {value}
    bind:groupValue={parent.value}
    {label}
    selectionButton={parent.grid}
    compact={parent.compact}
    {checked}
    disabled={disabled ?? parent.disabled}
    {required}
    invalid={parent.invalid}
    {...rest}
/>
{/if}