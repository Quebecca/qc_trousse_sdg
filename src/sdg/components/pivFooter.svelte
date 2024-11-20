<svelte:options customElement="{{
    tag: 'qc-piv-footer'
    , props: {
        logoUrl : {attribute: 'logo-url'}
        , logoAlt : {attribute: 'logo-alt'}
        , logoWidth : {attribute: 'logo-width'}
        , logoHeight : {attribute: 'logo-height'}
        , copyrightText : {attribute: 'copyrightText'}
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
    , logoSrc = `${Utils.imagesRelativePath}logo-quebec-piv-footer.svg`
    , logoAlt = 'Gouvernement du Québec'
    , logoWidth = '117'
    , logoHeight = '35'
    , copyrightText = '© Gouvernement du Québec, ' + (new Date()).getFullYear()
    , copyrightUrl = lang === 'fr'
                        ? 'https://www.quebec.ca/droit-auteur'
                        : 'https://www.quebec.ca/en/copyright'
    ;

</script>


<slot/>
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

<style lang="scss">
    @use "base/typography";

    :host {
      display: flex;
      flex-direction: column;
      align-items: center;

      margin-top: rem(40);
      padding-bottom: rem(4 * $base-spacer);
      @include content-font(sm);
    }

    a {
      text-decoration: none;

      &:hover {
        text-decoration: underline;
      }
    }
  .copyright {
    margin-top: rem(32);
  }

</style>

