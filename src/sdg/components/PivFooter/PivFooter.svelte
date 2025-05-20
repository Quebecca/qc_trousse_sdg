<script>
    import { Utils } from "../utils"

    const lang = Utils.getPageLanguage();

    let {
        logoUrl = '/',
        logoSrc = Utils.imagesRelativePath + '/QUEBEC_couleur.svg',
        logoSrcDarkTheme = Utils.imagesRelativePath + '/QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of the Quebec government',
        copyrightText = '© Gouvernement du Québec, ' + (new Date()).getFullYear(),
        logoWidth = 139,
        logoHeight = 50,
        copyrightUrl = lang === 'fr' ? 'https://www.quebec.ca/droit-auteur' : 'https://www.quebec.ca/en/copyright'
    } = $props();
</script>

<div class="qc-piv-footer qc-container-fluid">
    <slot/>

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
        <slot name="copyright">
            <a href="{copyrightUrl}">
                {copyrightText}
            </a>
        </slot>
    </span>
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>

