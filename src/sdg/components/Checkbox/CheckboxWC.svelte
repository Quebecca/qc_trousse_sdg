<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        value: { attribute: 'value', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        description: {attribute: 'description', type: 'String'},
        name: { attribute: 'name', type: 'String' },
        disabled: { attribute: 'disabled', type: 'Boolean' },
        checked: { attribute: 'checked', type: 'Boolean', reflect: true },
        required: { attribute: 'required', type: 'Boolean' },
        compact: { attribute: 'compact', type: 'Boolean' },
        tiled: {attribute: 'tiled', type: 'Boolean'},
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static parentGroup;

            constructor() {
                super();
                this.parentGroup = this.closest('qc-checkbox-group');
            }
        };
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    import {Utils} from '../utils.js';

    let {
        parentGroup,
        value, 
        label,
        description,
        name,
        disabled, 
        checked = $bindable(false),
        required, 
        compact,
        tiled,
        invalid = $bindable(false),
        invalidText,
        ...rest
    } = $props();


    if (parentGroup) {
        compact = parentGroup.compact
        invalid = parentGroup.invalid
        name = parentGroup.name
    }


</script>

<Checkbox
    {value}
    label={label ?? value}
    {name}
    {description}
    disabled={parentGroup?.disabled ?? disabled}
    bind:checked
    required={parentGroup?.required ?? required}
    tiled={parentGroup?.tiled ?? tiled}
    {compact}
    bind:invalid
    {invalidText}
    {parentGroup}
    {...Utils.computeFieldsAttributes("checkbox", rest)}
></Checkbox>