<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        id: { attribute: 'id', type: 'String' },
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

    let {
        // Il est nécessaire de déclarer une valeur par défaut pour id dans le wrapper en raison de cycles de vie
        // d'éléments HTML et props.
        id = `${name}-${value}-${Math.random().toString(36).substring(2, 15)}`,
        parentGroup,
        value, 
        label,
        description,
        name,
        disabled = $bindable(false),
        required = $bindable(false),
        checked = $bindable(false),
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
    disabled={disabled ?? parentGroup?.disabled}
    bind:checked
    required={parentGroup?.required ?? required}
    tiled={parentGroup?.tiled ?? tiled}
    {compact}
    bind:invalid
    {invalidText}
    {parentGroup}
    {...rest}
></Checkbox>