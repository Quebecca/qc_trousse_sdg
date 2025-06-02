<svelte:options customElement={{
  tag: 'qc-checkbox-group',
  shadow: 'none',
  props: {
    groupId: { attribute: 'group-id' },
    legend: { attribute: 'legend' },
    name: { attribute: 'name' },
    options: { attribute: 'options' }
  }
}} />

<script>
    import CheckboxGroup from './CheckboxGroup.svelte';

    let {
    groupId = '',
    legend = '',
    name = '',
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
        {groupId}
        {legend}
        {name}
        options={parsedOptions}
/>

