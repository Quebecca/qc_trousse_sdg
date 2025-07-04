<svelte:options customElement="{{
    tag: 'qc-radio-button',
    shadow: 'none',
    props: {
        value: {attribute:'value', type: 'String'},
        label: {attribute:'label', type: 'String'},
        checked: {attribute: 'checked', type: 'Boolean'},
        disabled: {attribute:'disabled', type: 'Boolean'},
        description: {attribute: 'description', type: 'String'},

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
    import {Utils} from '../utils.js';

    let {
        parent,
        name,
        value,
        label,
        description,
        checked = $bindable(false),
        disabled,
        invalid = $bindable(false),
        ...rest
    } = $props();

    $effect(() => {
        if(checked) {
            parent.value = value;
        }
    })

</script>
{#if parent}
<RadioButton
    name={parent.name}
    {value}
    bind:groupValue={parent.value}
    {label}
    compact={parent.compact}
    {description}
    tiled={parent.tiled}
    {checked}
    disabled={disabled ?? parent.disabled}
    required={parent.required}
    invalid={parent.invalid}
    {...Utils.computeFieldsAttributes("radio", rest)}
/>
{/if}