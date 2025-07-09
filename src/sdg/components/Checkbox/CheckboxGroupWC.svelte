<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        compact: { attribute: 'compact', type: 'Boolean' },
        required: { attribute: 'required', type: 'Boolean' },
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' },
        tiled: {attribute: 'tiled', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static formFieldElements;
            constructor() {
                super();
                this.formFieldElements = Array.from(this.querySelectorAll('qc-checkbox'));
                this.formFieldElements.forEach((element) => {
                    element.classList.add('qc-check-row-parent');
                })
            }
        };
    }
}} />

<script>
    import CheckboxGroup from "./CheckboxGroup.svelte";

    let {
        formFieldElements,
        value = $bindable([]),
        checked = $bindable(false),
        legend,
        name,
        compact,
        required = $bindable(false),
        disabled = $bindable(false),
        invalid = $bindable(false),
        invalidText,
        tiled,
        columnCount,
        inline,
    } = $props();

</script>

<CheckboxGroup
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
    {tiled}
    {columnCount}
    {inline}
/>