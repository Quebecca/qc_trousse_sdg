<svelte:options customElement={{
  tag: 'qc-checkbox-group',
  shadow: 'none',
  props: {
    groupId: { attribute: 'group-id' },
    legend: { attribute: 'legend' },
    name: { attribute: 'name' },
    options: { attribute: 'options' } // reste une chaîne JSON
  }
}} />

<script>
    import CheckboxGroup from './CheckboxGroup.svelte';

    export let groupId = '';
    export let legend = '';
    export let name = '';
    export let options = [];



    // Parser si options est une chaîne JSON
    $: parsedOptions = typeof options === 'string'
        ? (() => {
            try {
                return JSON.parse(options);
            } catch (e) {
                console.error('Erreur de parsing des options :', e);
                return [];
            }
        })()
        : options;
</script>

<CheckboxGroup
        {groupId}
        {legend}
        {name}
        options={parsedOptions}
/>

