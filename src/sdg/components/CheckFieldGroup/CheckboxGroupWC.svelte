<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    props: {
        compact: { attribute: 'compact', type: 'Boolean' },
        required: { attribute: 'required', type: 'Boolean' },
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' },
        tiled: {attribute: 'tiled', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    }
}} />

<script>
    import CheckFieldGroup from "./CheckFieldGroup.svelte";
    import {onMount} from "svelte";
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
    let single = $state(false);

    onMount(() => {
        single = $host().children.length === 1;
    })
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
        {single}
>
        <slot/>
</CheckFieldGroup>
