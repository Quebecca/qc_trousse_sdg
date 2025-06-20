<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    shadow: 'none',
    props: {
        compact: { attribute: 'compact', type: 'Boolean' },
        required: { attribute: 'required', type: 'Boolean' },
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static formFieldElements;
            constructor() {
                super();
                this.formFieldElements = Array.from(this.querySelectorAll('qc-checkbox'));
            }
        };
    }
}} />

<script>
    // import CheckboxGroup from "./CheckboxGroup.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";
    let {
        formFieldElements,
        value = $bindable([]),
        checked = $bindable(false),
        legend,
        name,
        compact,
        required,
        disabled,
        invalid = $bindable(false),
        invalidText
    } = $props();

    let updateValue = function () {
        value = formFieldElements
            .map(cb => cb.checked ? cb.value : false)
            .filter(x => x);
    }

</script>

<CheckFieldGroup
    {formFieldElements}
    bind:value
    bind:checked
    {legend}
    {name}
    {compact}
    {required}
    bind:invalid
    {disabled}
    {invalidText}
    {updateValue}
/>