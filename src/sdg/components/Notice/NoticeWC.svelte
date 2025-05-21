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

    const defaultType = 'information';
    const defaultHeader = 'h2';

    let {
        title = "",
        type = defaultType,
        content = "",
        header = defaultHeader,
        icon,
    } = $props();
</script>

{#snippet slotContent()}
    {@const contentHtml = `<slot />`}
    {@html contentHtml}
{/snippet}

<Notice
    {title}
    {type}
    {content}
    {header}
    {icon}
    {slotContent}
/>
