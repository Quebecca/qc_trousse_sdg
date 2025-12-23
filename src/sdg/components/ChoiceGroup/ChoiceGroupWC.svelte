<svelte:options customElement="{{
    tag: 'qc-choice-group',
    props: {
        name: {attribute: 'name', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        compact: {attribute:'compact', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean'},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        invalidOnBlur: {attribute: 'invalid-on-blur', type: 'Boolean'},
        selectionButton: {attribute: 'selection-button', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    }
}}" />

<script>
    import ChoiceGroup from "./ChoiceGroup.svelte";
    import {Utils} from "../utils";

    let {
        name,
        legend,
        compact,
        required,
        invalid = $bindable(false),
        invalidText,
        invalidOnBlur,
        selectionButton,
        columnCount,
        inline
    } = $props();

</script>
<ChoiceGroup
        {name}
        {legend}
        {compact}
        {required}
        bind:invalid
        {invalidText}
        {invalidOnBlur}
        {selectionButton}
        {columnCount}
        {inline}
        host={$host()}
>
    <slot/>
</ChoiceGroup>
<link rel='stylesheet' href='{Utils.cssPath}'>
