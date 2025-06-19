<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        grid = false,
        flowDirection,
        elementsPerRowOrCol = 1,
        ...restProps
    } = $props();


    let updateValue = function () {
        value = formFieldElements
            .map(cb => cb.checked ? cb.value : false)
            .filter(x => x);
        checked = value.length > 0;
        if (checked) {
            invalid = false;
        }
    }

</script>

<Fieldset
        {grid}
        flowDirection={flowDirection === "column" ? flowDirection : "row"}
        {elementsPerRowOrCol}
        {...restProps}
        bind:value
        bind:checked
        bind:invalid
        {updateValue}
        {formFieldElements}
/>

