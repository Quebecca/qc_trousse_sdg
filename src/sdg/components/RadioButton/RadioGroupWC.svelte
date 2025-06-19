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
        flowDirection: {attribute: 'flow-direction', type: 'String'},
        elementsPerRowOrCol: {attribute: 'elements-per-row-or-col', type: 'String'}
    },

    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static formFieldElements;

            constructor() {
                super();
                this.formFieldElements = Array.from(this.querySelectorAll('qc-radio-button'));

                const tiles = Array.from(this.querySelectorAll('qc-radio-selection-button'));
                tiles.forEach((tile) => {
                    tile.classList.add('qc-radio-select-parent');
                })
                this.formFieldElements.push(...tiles);
            }
        }
    }
}}" />

<script>
    import RadioGroup from "./RadioGroup.svelte";

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
        flowDirection,
        elementsPerRowOrCol
    } = $props();

</script>

<RadioGroup
    {name}
    {legend}
    {compact}
    {formFieldElements}
    {required}
    {disabled}
    {invalid}
    {invalidText}
    bind:value
    bind:checked
    {tiled}
    {flowDirection}
    {elementsPerRowOrCol}
/>

