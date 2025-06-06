<svelte:options customElement={{
    tag: 'qc-checkbox-inner',
    shadow: 'none',
    props: {
        value: { attribute: 'value', type: 'String' },
        label: { attribute: 'label', type: 'String' },
        name: { attribute: 'name', type: 'String' }
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            static inner;
            static outer;

            constructor() {
                super();
                this.inner = this;
                this.outer = this.closest('qc-checkbox-outer');
            }
        };
    }
}} />

<script>

    import CheckboxInner from "./CheckboxInner.svelte";

    let {inner, outer, value, label, name} = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(outer?.getAttribute('name') || name || '');
</script>

<CheckboxInner
        value={effectiveValue}
        {label}
        name={effectiveName}
></CheckboxInner>