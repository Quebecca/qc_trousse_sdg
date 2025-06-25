<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        tiled = false,
        flowDirection = "column",
        elementsPerRowOrCol = 1,
        ...restProps
    } = $props();


    let updateValue = function () {
        value = formFieldElements
            .map(cb => cb.querySelector("input").checked ? cb.value : false)
            .filter(x => x);
        checked = value.length > 0;
        if (checked) {
            invalid = false;
        }
    }
</script>

<Fieldset
        {...restProps}
        bind:value
        bind:checked
        bind:invalid
        {updateValue}
        {formFieldElements}
/>

