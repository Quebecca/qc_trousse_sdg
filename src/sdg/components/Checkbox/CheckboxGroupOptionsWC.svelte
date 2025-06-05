<svelte:options customElement={{
  tag: 'qc-checkbox-group-options',
  shadow: 'none',
  props: {
    legend: { attribute: 'legend' },
    name: { attribute: 'name' },
    size: { attribute: 'size' },
    options: { attribute: 'options' }
  }
}} />

<script>
    import CheckboxGroupOptions from './CheckboxGroupOptions.svelte';

    let {
    legend = '',
    name = '',
    size = 'md',
    options = []
    } = $props();

    let parsedOptions = $derived(typeof options === 'string'
        ? (() => {
            try {
                const parsed = JSON.parse(options);
                return parsed.map(option => ({
                    ...option,
                    value: option.value || option.label
                }));
            } catch (e) {
                console.error('Erreur de parsing des options :', e);
                return [];
            }
        })()
        : options.map(option => ({
            ...option,
            value: option.value || option.label
        })));
</script>

<CheckboxGroupOptions
        {legend}
        {name}
        {size}
        options={parsedOptions}
/>