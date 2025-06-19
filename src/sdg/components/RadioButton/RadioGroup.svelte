<script>
    import Fieldset from "../Fieldset/Fieldset.svelte";

    let {
        formFieldElements,
        checked = $bindable(false),
        invalid = $bindable(false),
        value = $bindable([]),
        grid = false,
        flowDirection = "column",
        elementsPerRowOrCol = 1,
        ...restProps
    } = $props();

    $effect(_ => {
        checked = !!value
        if (checked) {
            invalid = false;
        }
    });
</script>

<Fieldset
        {grid}
        {flowDirection}
        {elementsPerRowOrCol}
        {...restProps}
        bind:value
        bind:checked
        bind:invalid
        {formFieldElements}
/>

