<svelte:options customElement="{{
    tag: 'qc-piv-header'
  , props: {
      logoUrl : {attribute: 'logo-url'}
    , fullWidth : {attribute: 'full-width'}
    , logoSrc : {attribute: 'logo-src'}
    , logoAlt : {attribute: 'logo-alt'}
    , titleUrl : {attribute: 'title-url'}
    , titleText: {attribute: 'title-text'}
    , linksLabel: {attribute: 'links-label'}
    , altLanguageText: {attribute: 'alt-language-text'}
    , altLanguageUrl: {attribute: 'alt-language-url'}
    , joinUsText: {attribute: 'join-us-text'}
    , joinUsUrl: {attribute: 'join-us-url'}
    , goToContent: {attribute: 'go-to-content'}
    , goToContentAnchor : {attribute: 'go-to-content-anchor'}
    , goToContentText: {attribute: 'go-to-content-text'}
    , displaySearchText : {attribute: 'display-search-text'}
    , hideSearchText : {attribute: 'hide-search-text'}
    , enableSearch : {attribute: 'enable-search'}
    , showSearch : {attribute: 'show-search'}
  }
}}" />

<script>
    import { Utils } from "../utils";
    import PivHeader from "./PivHeader.svelte";

    const lang = Utils.getPageLanguage();

    let {
        logoUrl = '/',
        fullWidth = 'false',
        logoSrc,
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of government of Québec',
        titleUrl = '/',
        titleText = '',
        linksLabel = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation',
        altLanguageText = lang === 'fr' ? 'English' : 'Français',
        altLanguageUrl = '',
        joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us',
        joinUsUrl = '',
        goToContent = 'true',
        goToContentAnchor = '#main',
        goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content',
        displaySearchText = lang === 'fr' ? 'Cliquer pour faire une recherche' : 'Click to search',
        hideSearchText = lang === 'fr' ? 'Masquer la barre de recherche' : 'Hide search bar',
        enableSearch = 'false',
        showSearch = 'false',
    } = $props()

    $inspect(Utils.assetsBasePath);

    $effect(() => {
        console.log(Utils.assetsBasePath);
    })
    export function focusOnSearchInput() {
        if (displaySearchForm) {
            document.querySelector('[slot="search-zone"] input')?.focus();
        }
    }
</script>

{#snippet links()}
    <slot name="links">
        {#if joinUsUrl || altLanguageUrl}
            <nav aria-label="{linksLabel}">
                <ul>
                    {#if altLanguageUrl}
                        <li><a href="{altLanguageUrl}">{altLanguageText}</a></li>
                    {/if}
                    {#if joinUsUrl}
                        <li><a href="{joinUsUrl}">{joinUsText}</a></li>
                    {/if}
                </ul>
            </nav>
        {/if}
    </slot>
{/snippet}

{#snippet search()}
    <slot name="search-zone" />
{/snippet}

<PivHeader
    {logoUrl}
    {fullWidth}
    {logoSrc}
    {logoAlt}
    {titleUrl}
    {titleText}
    {linksLabel}
    {altLanguageText}
    {altLanguageUrl}
    {joinUsText}
    {joinUsUrl}
    {goToContent}
    {goToContentAnchor}
    {goToContentText}
    {displaySearchText}
    {hideSearchText}
    {enableSearch}
    {showSearch}
    {links}
    {search}
></PivHeader>
