<svelte:options customElement={{
    tag: 'qc-checkbox',
    props: {
        required: { attribute: 'required', type: 'Boolean' },
        compact: { attribute: 'compact', type: 'Boolean' },
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    import {onMount, setContext} from "svelte";
    import {Utils} from "../utils";
    import {onChange} from "./updateInput.svelte";

    setContext('qc-checkbox', true);

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText
    } = $props();
    let requiredSpan = $state(null),
        labelElement = $state(),
        input = $state()
    ;

    onMount(() => {
        labelElement = $host()
            .querySelector("label")
        input = Array.from($host().querySelectorAll('input'))
            .find(i => i.getAttribute('type') === 'checkbox')
        console.log($host().querySelectorAll("input"));
        onChange(input, _invalid => invalid = _invalid)
    })

</script>
<Checkbox
    bind:invalid
    {compact}
    {required}
    {invalidText}
    {labelElement}
    {input}
    bind:requiredSpan
    >
    <slot />
</Checkbox>
<link rel='stylesheet' href='{Utils.cssPath}'>
