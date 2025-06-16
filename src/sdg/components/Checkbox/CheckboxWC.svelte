<svelte:options customElement={{
    tag: 'qc-checkbox',
    shadow: 'none',
    props: {
        value: { attribute: 'value', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        name: { attribute: 'name', type: 'String' },
        disabled: { attribute: 'disabled', type: 'Boolean' },
        checked: { attribute: 'checked', type: 'Boolean' },
        required: { attribute: 'required', type: 'Boolean' },
        size: { attribute: 'size', type: 'String' },
        invalid: { attribute: 'invalid', type: 'Boolean' },
        invalidText: { attribute: 'invalid-text', type: 'String' }
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inner;
            static outer;

            constructor() {
                super();
                this.inner = this;
                this.outer = this.parentNode.tagName === "QC-CHECKBOX-GROUP" ? this.parentNode : null;
            }
        };
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";
    import { onMount } from "svelte";

    let {
        inner, 
        outer, 
        value, 
        label, 
        name, 
        disabled, 
        checked, 
        required, 
        size,
        invalid,
        invalidText,
        ...rest
    } = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(outer?.getAttribute('name') || name || '');
    let effectiveSize = $derived(outer?.getAttribute('size') || size || 'md');

    onMount(() => {
        if (invalid === "") {
            invalid = "true";
        }
    });
</script>

<Checkbox
    value={effectiveValue}
    {label}
    name={effectiveName}
    disabled={outer?.disabled ?? disabled}
    {checked}
    required={outer?.required ?? required}
    size={effectiveSize}
    invalid={outer ? false : invalid}
    {invalidText}
    hasParentGroup={outer !== null && outer !== undefined}
    {...rest}
></Checkbox>