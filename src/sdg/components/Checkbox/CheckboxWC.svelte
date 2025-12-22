<svelte:options customElement={{
    tag: 'qc-checkbox',
    props: {
        required: { attribute: 'required', type: 'Boolean' },
        compact: { attribute: 'compact', type: 'Boolean' },
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' },
        invalidOnBlur: { attribute: 'invalid-on-blur', type: 'Boolean' },
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    import {onMount, setContext} from "svelte";
    import {Utils} from "../utils";
    import {onChange, onBlur} from "./updateChoiceInput.svelte.js";

    setContext('qc-checkbox', true);

    let {
        required = $bindable(false),
        compact,
        invalid = $bindable(false),
        invalidText,
        invalidOnBlur
    } = $props();
    let requiredSpan = $state(null),
        labelElement = $state(),
        input = $state(),
        checked = $state(false)
    ;

    onMount(() => {
        labelElement = $host()
            .querySelector("label");
        input = $host().querySelector('input[type="checkbox"]');
        onChange(input, _invalid => {
            invalid = _invalid;
            checked = input.checked;
        });

        if (invalidOnBlur) {
            onBlur(input, () => {
                invalid = required && !checked;
            });
        }
    })
</script>
<Checkbox
    bind:invalid
    {compact}
    {required}
    {invalidText}
    {invalidOnBlur}
    {labelElement}
    {input}
    bind:requiredSpan
    bind:checked
    >
    <slot />
</Checkbox>
<link rel='stylesheet' href='{Utils.cssPath}'>
