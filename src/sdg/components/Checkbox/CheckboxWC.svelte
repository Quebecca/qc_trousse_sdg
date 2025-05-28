<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        value: { attribute: 'value', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        name: { attribute: 'name', type: 'String' },
        disabled: { attribute: 'disabled', type: 'Boolean' },
        checked: { attribute: 'checked', type: 'Boolean', reflect: true },
        required: { attribute: 'required', type: 'Boolean' },
        compact: { attribute: 'compact', type: 'Boolean' },
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
        name,
        disabled,
        checked = $bindable(false),
        required,
        compact,
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
    name={effectiveName}
    disabled={parentGroup?.disabled ?? disabled}
    bind:checked
    required={parentGroup?.required ?? required}
    {compact}
    bind:invalid
    {invalidText}
    {parentGroup}
    {...rest}
></Checkbox>