<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {onMount} from "svelte";
    import {updateInput} from "../Checkbox/updateInput.svelte";

    let {
        invalid = $bindable(false),
        invalidText,
        children,
        compact = false,
        selectionButton = false,
        host,
        name,
        required,
        ...restProps
    } = $props();
    let fieldsetElement = $state();

    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }
    $effect(() => {
        (host ? host : fieldsetElement)
            .querySelectorAll('input, .qc-choicefield')
            .forEach(
                input =>
                    updateInput(
                        input,
                        required,
                        invalid,
                        compact ? compact : selectionButton,
                        name)
            )
    })


</script>
<Fieldset
    {required}
    {compact}
    {selectionButton}
    bind:invalid
    {invalidText}
    {onchange}
    bind:rootElement={fieldsetElement}
    {...restProps}
>
    {@render children()}
</Fieldset>

