<svelte:options customElement="{{
    tag: 'qc-radio-group',
    shadow: 'none',
    props: {
        name: {attribute: 'name', type: 'String'},
        value: {attribute: 'value', type: 'String'},
        legend: {attribute:'legend', type: 'String'},
        compact: {attribute:'compact', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean'},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        tiled: {attribute: 'tiled', type: 'Boolean'},
        columnCount: {attribute: 'column-count', type: 'String'},
        inline: {attribute: 'inline', type: 'Boolean'}
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static formFieldElements;

            constructor() {
                super();
                this.formFieldElements = Array.from(this.querySelectorAll('qc-radio-button'));
                this.formFieldElements.forEach((element) => {
                    element.classList.add('qc-check-row-parent');
                })
            }
        }
    }
}}" />

<script>
    // import RadioGroup from "./RadioGroup.svelte";
    import CheckFieldGroup from "./CheckFieldGroup.svelte";

    let {
        name,
        legend,
        compact,
        formFieldElements,
        required,
        disabled,
        invalid = $bindable(false),
        invalidText,
        value = $bindable(""),
        checked=$bindable(false),
        tiled,
        columnCount,
        inline
    } = $props();

</script>

<CheckFieldGroup
        {name}
        {legend}
        {compact}
        {formFieldElements}
        {required}
        {disabled}
        bind:invalid
        {invalidText}
        bind:value
        bind:checked
        {tiled}
        {columnCount}
        {inline}
/>

