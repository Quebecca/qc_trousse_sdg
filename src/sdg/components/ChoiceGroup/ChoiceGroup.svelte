<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {onMount} from "svelte";
    import {updateChoiceInput} from "../Checkbox/updateChoiceInput.svelte.js";

    let {
        invalid = $bindable(false),
        invalidText,
        children,
        compact = false,
        selectionButton = false,
        inline = false,
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
                    updateChoiceInput(
                        input,
                        required,
                        invalid,
                        compact,
                        selectionButton,
                        inline,
                        name)
            )
    })


</script>
<Fieldset
    {required}
    {compact}
    {selectionButton}
    {inline}
    bind:invalid
    {invalidText}
    {onchange}
    bind:rootElement={fieldsetElement}
    {...restProps}
>
    {@render children()}
</Fieldset>

