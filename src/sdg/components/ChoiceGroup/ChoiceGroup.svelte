<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";
    import {onMount} from "svelte";
    import {updateInput} from "../Checkbox/updateInput.svelte";

    let {
        invalid = $bindable(false),
        invalidText,
        children,
        host,
        name,
        required,
        ...restProps
    } = $props();
    let fieldsetElement = $state();

    onMount(() => {
        (host ? host : fieldsetElement)
            .querySelectorAll('input, .qc-choicefield')
            .forEach(input => updateInput(input, required, invalid, name))

    })

    let onchange = e => {
        if (invalid && e.target.checked) {
            invalid = false;
        }
    }

</script>
<Fieldset
    {required}
    bind:invalid
    {invalidText}
    {onchange}
    bind:rootElement={fieldsetElement}
    {...restProps}
>
    {@render children()}
</Fieldset>

