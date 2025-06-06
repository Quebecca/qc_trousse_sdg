<svelte:options customElement={{
    tag: 'qc-checkbox',
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
                this.outer = this.closest('qc-checkbox-group');
            }
        };
    }
}} />

<script>

    import Checkbox from "./Checkbox.svelte";

    let {inner, outer, value, label, name} = $props();

    let effectiveValue = $derived(value || label);
    let effectiveName = $derived(outer?.getAttribute('name') || name || '');
</script>

<Checkbox
        value={effectiveValue}
        {label}
        name={effectiveName}
></Checkbox>