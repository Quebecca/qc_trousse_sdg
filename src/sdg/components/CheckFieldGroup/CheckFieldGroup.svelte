<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        updateValue = () => {},
        ...restProps
    } = $props();




    $effect(_ => {
        // console.log("cb group svelte effect")
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
/>

