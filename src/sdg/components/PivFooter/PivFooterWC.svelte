<svelte:options customElement="{{
    tag: 'qc-piv-footer'
    , props: {
        logoUrl : {attribute: 'logo-url'}
        , logoSrc : {attribute: 'logo-src'}
        , logoSrcDarkTheme: {attribute: 'logo-src-dark-theme'}
        , logoAlt : {attribute: 'logo-alt'}
        , logoWidth: {attribute: 'logo-width'}
        , logoHeight: {attribute: 'logo-height'}
        , copyrightText : {attribute: 'copyright-text'}
        , copyrightUrl : {attribute: 'copyright-url'}

    }}
}}" />

<script>
    import { Utils } from "../utils";
    import PivFooter from "./PivFooter.svelte";

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

<PivFooter
    {logoUrl}
    {logoSrc}
    {logoSrcDarkTheme}
    {logoAlt}
    {copyrightText}
    {logoWidth}
    {logoHeight}
    {copyrightUrl}
></PivFooter>