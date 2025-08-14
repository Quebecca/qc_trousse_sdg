<svelte:options customElement="{{
    tag: 'qc-choice-group',
    props: {
        name: {attribute: 'name', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        compact: {attribute:'compact', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean'},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        tiled: {attribute: 'tiled', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    }
}}" />

<script>
    import ChoiceGroup from "./ChoiceGroup.svelte";
    import {updateInput} from "../Checkbox/updateInput.svelte";
    let {
        name,
        legend,
        compact,
        required,
        disabled,
        invalid = $bindable(false),
        invalidText,
        checked=$bindable(false),
        tiled,
        columnCount,
        inline
    } = $props();

    $effect(() =>  updateInput($host(), required, invalid, name))

</script>
<ChoiceGroup
        {name}
        {legend}
        {compact}
        {required}
        {disabled}
        bind:invalid
        {invalidText}
        bind:checked
        {tiled}
        {columnCount}
        {inline}
>
    <slot/>
</ChoiceGroup>

