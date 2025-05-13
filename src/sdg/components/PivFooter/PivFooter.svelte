<script>
    import { Utils } from "../utils"
    import DefaultCopyright from "./_defaultCopyright.svelte";
    const lang = Utils.getPageLanguage();

    let {
        logoUrl = '/',
        logoSrc = Utils.imagesRelativePath + '/QUEBEC_couleur.svg',
        logoSrcDarkTheme = Utils.imagesRelativePath + '/QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of the Quebec government',
        copyrightText,
        logoWidth = 139,
        logoHeight = 50,
        copyrightUrl,
        mainSlot,
        copyrightSlot
    } = $props();
</script>

<div class="qc-piv-footer qc-container-fluid">
    {#if mainSlot}
        {@render mainSlot()}
    {/if}

    <a href="{logoUrl}"
       class="logo"
       style:--logo-width={logoWidth}
       style:--logo-height={logoHeight}
    >
        {#each [
            ['light', logoSrc],
            ['dark', logoSrcDarkTheme]]
        as [theme, src]}
            <img {src}
                 alt="{logoAlt}"
                 class="qc-{theme}-theme-show"
            />
        {/each}
    </a>

    <span class="copyright">
        {#if copyrightSlot}
            {@render copyrightSlot()}
        {:else}
            <DefaultCopyright {copyrightText} {copyrightUrl} />
        {/if}
    </span>
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>

