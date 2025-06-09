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
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inner;
            static outer;

            constructor() {
                super();
                this.inner = this;
                this.outer = this.closest('qc-checkbox-group');
            }
        };
    }
}} />

<script>
    import Checkbox from "./Checkbox.svelte";

    let {inner, outer, value, label, name, disabled, checked, required, size} = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(outer?.getAttribute('name') || name || '');
    let effectiveSize = $derived(outer?.getAttribute('size') || size || 'md');
</script>

<Checkbox
    value={effectiveValue}
    {label}
    name={effectiveName}
    {disabled}
    {checked}
    {required}
    size={effectiveSize}
></Checkbox>