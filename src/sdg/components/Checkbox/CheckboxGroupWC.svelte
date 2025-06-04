<svelte:options customElement={{
  tag: 'qc-checkbox-group',
  shadow: 'none',
  props: {
    legend: { attribute: 'legend' },
    name: { attribute: 'name' },
    size: { attribute: 'size' },
    options: { attribute: 'options' }
  }
}} />

<script>
    import CheckboxGroup from './CheckboxGroup.svelte';

    let {
    legend = '',
    name = '',
    size = 'md',
    options = []
    } = $props();

    let parsedOptions = $derived(typeof options === 'string'
        ? (() => {
            try {
                return JSON.parse(options);
            } catch (e) {
                console.error('Erreur de parsing des options :', e);
                return [];
            }
        })()
        : options);
</script>

<CheckboxGroup
        {legend}
        {name}
        {size}
        options={parsedOptions}
/>

