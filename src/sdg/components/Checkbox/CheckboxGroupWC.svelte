<svelte:options customElement={{
    tag: 'qc-checkbox-group',
    shadow: 'none',
    props: {
        compact: { attribute: 'compact', type: 'Boolean' },
        required: { attribute: 'required', type: 'Boolean' },
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' },
        tiled: {attribute: 'tiled', type: 'Boolean'},
        flowDirection: {attribute: 'flow-direction', type: 'String'},
        elementsPerRowOrCol: {attribute: 'elements-per-row-or-col', type: 'String'}
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static formFieldElements;
            constructor() {
                super();
                this.formFieldElements = Array.from(this.querySelectorAll('qc-checkbox'));
                const tiles = Array.from(this.querySelectorAll('qc-checkbox-selection-button'));
                this.formFieldElements.push(...tiles);
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
        flowDirection,
        elementsPerRowOrCol
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
    {flowDirection}
    {elementsPerRowOrCol}
/>