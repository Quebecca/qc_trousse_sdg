<svelte:options customElement="qc-piv-footer" />

<script>

import { Utils } from "./utils"
import { get_current_component } from "svelte/internal"  

const
    lang = Utils.getPageLanguage()
    ;

export let
      logoUrl = '/'
    , logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=_vSDG_#logo-quebec-piv-footer`
    , logoAlt = 'Gouvernement du Québec'
    , logoWidth = '117'
    , logoHeight = '35'
    , copyrightText = '© Gouvernement du Québec, ' + (new Date()).getFullYear()
    , copyrightUrl = lang === 'fr'
                        ? 'https://www.quebec.ca/droit-auteur'
                        : 'https://www.quebec.ca/en/copyright'
    ;

</script>

<div class="qc-piv-footer qc-component">
    <div class="qc-container">
        <nav>
            <slot/>
        </nav>
        <div class="logo">
            <slot name="logo">
                <a href="{logoUrl}">
                    <img class="logo-mo"
                         alt="{logoAlt}"
                         src="{logoSrc}"
                         width="{logoWidth}"
                         height="{logoHeight}">
                </a>
            </slot>
        </div>
        <span class="copyright">
            <slot name="copyright">
                <a href="{copyrightUrl}">
                    {copyrightText}
                </a>
            </slot>
        </span>
    </div>

</div>

<link rel='stylesheet'
      href='{Utils.cssRelativePath}{Utils.cssFileName}'>