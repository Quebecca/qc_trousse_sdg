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
        selectionButton: {attribute: 'selection-button', type: 'Boolean'},
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

    let {
        parentGroup,
        value,
        label,
        description,
        name,
        disabled = $bindable(false),
        required = $bindable(false),
        checked = $bindable(false),
        compact,
        selectionButton,
        invalid = $bindable(false),
        invalidText,
        ...rest
    } = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(parentGroup?.getAttribute('name') || name || '');
    if (parentGroup) {
        compact = parentGroup.compact
        invalid = parentGroup.invalid
    }

</script>

<Checkbox
    bind:value={effectiveValue}
    {label}
    {description}
    name={effectiveName}
    disabled={disabled ?? parentGroup?.disabled}
    bind:checked
    required={parentGroup?.required ?? required}
    {compact}
    selectionButton={parentGroup?.grid ?? selectionButton}
    bind:invalid
    {invalidText}
    {parentGroup}
    {...rest}
></Checkbox>