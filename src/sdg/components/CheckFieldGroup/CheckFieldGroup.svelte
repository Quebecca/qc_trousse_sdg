<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        updateValue = () => {},
        children,
        ...restProps
    } = $props();

    $effect(() => {
        checked = !(!value || value.length === 0)
        if (checked) {
            invalid = false;
        }
    });
</script>

<Fieldset
    {...restProps}
    bind:value
    bind:checked
    bind:invalid
    {updateValue}
    {formFieldElements}
>
    {@render children?.()}
</Fieldset>

