<svelte:options customElement={{
  tag: 'qc-notice',
  props: {
    title: { attribute: 'title', type: 'String' },
    type: { attribute: 'type', type: 'String' },
    content: { attribute: 'content', type: 'String' },
    header: { attribute: 'header', type: 'String' },
    icon: { attribute: 'icon', type: 'String' }
  }
}} />

<script>
    import Notice from './Notice.svelte';

    const props = $props();
</script>


<Notice
    {...props}
>
    {#snippet slotContent()}
        <slot />
    {/snippet}
</Notice>
