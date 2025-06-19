<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        ...restProps
    } = $props();


    let updateValue = function () {
        console.log("updateValue", formFieldElements)
        value = formFieldElements
            .map(cb => cb.checked ? cb.value : false)
            .filter(x => x);
        checked = value.length > 0;
        if (checked) {
            invalid = false;
        }
    }
    $inspect("CB group svelte invalid", invalid)

</script>

<Fieldset
        {...restProps}
        bind:value
        bind:checked
        bind:invalid
        {updateValue}
        {formFieldElements}
/>

