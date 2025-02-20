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

import { Utils } from "./utils"
import { get_current_component } from "svelte/internal"  

const
    lang = Utils.getPageLanguage()
    ;

export let
      logoUrl = '/'
    , logoSrc = Utils.imagesRelativePath + '/QUEBEC_couleur.svg'
    , logoSrcDarkTheme = Utils.imagesRelativePath + '/QUEBEC_blanc.svg'
    , logoWidth = 139
    , logoHeight = 35
    , logoAlt = lang === 'fr'
        ? 'Logo du gouvernement du Québec'
        : 'Logo of the Quebec government'
    , copyrightText = '© Gouvernement du Québec, ' + (new Date()).getFullYear()
    , copyrightUrl = lang === 'fr'
                        ? 'https://www.quebec.ca/droit-auteur'
                        : 'https://www.quebec.ca/en/copyright'
    ;
</script>
<div class="qc-piv-footer">
    <slot/>
    <a href="{logoUrl}"
       class="logo"
    >
        {#each [
            ['light', logoSrc],
            ['dark', logoSrcDarkTheme]]
        as [theme, src]}
        <img {src}
             alt="{logoAlt}"
             width="{logoWidth}"
             height="{logoHeight}"
             class="qc-{theme}-theme-show"/>
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

