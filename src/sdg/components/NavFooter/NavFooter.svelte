<script>
    const defaultTitleTag = 'h2';
    const titleTags = ['h2', 'h3', 'h4', 'h5', 'h6'];

    let {
        titleText = '',
        titleUrl = '/',
        titleTag = defaultTitleTag,
        description = '',
        linksSlot,
        columnsSlot,
        // Vrai quand le composant est rendu par le web component : le contenu des zones
        // est alors slotté et mis en forme dans le DOM de la page (voir _navFooter.scss).
        webComponentMode = false
    } = $props();

    const usedTitleTag = $derived(titleTags.includes(titleTag) ? titleTag : defaultTitleTag);
    const usedTitleUrl = $derived(titleUrl || '/');

    $effect(() => {
        if (!titleText) {
            console.warn('qc-nav-footer : l’attribut title-text est obligatoire.');
        }
    });
</script>

<div class="qc-nav-footer qc-component">
    <div class="qc-container">
        {#if titleText}
            <svelte:element this={usedTitleTag} class="qc-nav-footer-title">
                <a href={usedTitleUrl}>{titleText}</a>
            </svelte:element>
        {/if}
        {#if description}
            <p class="qc-nav-footer-description">{description}</p>
        {/if}
        {#if linksSlot}
            <div class={webComponentMode ? 'qc-nav-footer-links-slot' : 'qc-nav-footer-links'}>
                {@render linksSlot()}
            </div>
        {/if}
        {#if columnsSlot}
            <div class={webComponentMode ? 'qc-nav-footer-columns-slot' : 'qc-nav-footer-columns'}>
                {@render columnsSlot()}
            </div>
        {/if}
    </div>
</div>
