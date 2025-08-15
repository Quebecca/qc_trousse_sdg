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

    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
          static self;

          constructor() {
            super();
            this.self = this;
          }
        }
    }
}}" />

<script>
    import PivFooter from "./PivFooter.svelte";
    import { Utils } from "../utils"

    let {
       self,
       ...props
    } = $props();

</script>
<PivFooter {...props} slots={$$slots}>
    {#snippet mainSlot()}
        <slot />
    {/snippet}
    {#snippet copyrightSlot()}
        <slot name="copyright" />
    {/snippet}
</PivFooter>
<link rel='stylesheet' href='{Utils.cssPath}'>
