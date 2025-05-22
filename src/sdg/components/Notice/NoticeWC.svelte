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

{#snippet slotContent()}
    {@const contentHtml = `<slot />`}
    {@html contentHtml}
{/snippet}

<Notice
    {...props}
    {slotContent}
/>
