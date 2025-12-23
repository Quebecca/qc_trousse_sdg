<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {onBlur, updateChoiceInput} from "../Checkbox/updateChoiceInput.svelte.js";
    import {Utils} from "../utils.js";

    let {
        invalid = $bindable(false),
        invalidText,
        invalidOnBlur,
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
        let inputs = Array.from((host ? host : fieldsetElement).querySelectorAll('input, .qc-choicefield'));

        inputs.forEach(input => {
            updateChoiceInput(
                input,
                required,
                invalid,
                compact,
                selectionButton,
                inline,
                name
            );

            if (invalidOnBlur) {
                onBlur(input, () => {
                    setTimeout(() => {
                        if (!(Utils.componentIsActive(host ? host : fieldsetElement) || inputs.find(input => input.checked))) {
                            invalid = true;
                        }
                    }, 0);
                });
            }
        });
    });
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

