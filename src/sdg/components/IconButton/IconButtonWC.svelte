<svelte:options customElement={{
  tag: 'qc-icon-button',
  shadow: 'none',
  props: {
    size: { attribute: 'size' },
    label: { attribute: 'label' },
    icon: { attribute: 'icon' },
    iconSize: { attribute: 'icon-size' },
    iconColor: { attribute: 'icon-color' }
  }
}} />

<script>
    import IconButton from './IconButton.svelte';

    const props = $props();
</script>

<IconButton {...props} />
