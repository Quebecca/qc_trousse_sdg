<svelte:options customElement="{{
    tag: 'qc-radio-group',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        compact: {attribute:'compact', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean'},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        tiled: {attribute: 'tiled', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    },


}}" />

<script>
    import CheckFieldGroup from "./CheckFieldGroup.svelte";
    import {updateInput} from "../Checkbox/updateInput.svelte";
    let {
        name,
        legend,
        compact,
        required,
        disabled,
        invalid = $bindable(false),
        invalidText,
        value = $bindable(""),
        checked=$bindable(false),
        tiled,
        columnCount,
        inline
    } = $props();

    $effect(() =>  updateInput($host(), required, invalid, name))

</script>
<CheckFieldGroup
        {name}
        {legend}
        {compact}
        {required}
        {disabled}
        bind:invalid
        {invalidText}
        bind:value
        bind:checked
        {tiled}
        {columnCount}
        {inline}
>
    <slot/>
</CheckFieldGroup>

