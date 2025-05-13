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
    import { Utils } from "../utils";
    import PivFooter from "./PivFooter.svelte";
    import DefaultCopyright from "./_defaultCopyright.svelte";

    const lang = Utils.getPageLanguage();

    let {
        copyrightText,
        copyrightUrl,
       self,
       slots,
       defaultSlot,
       ...props
    } = $props();
    $inspect(self,slots,defaultSlot);
</script>
<PivFooter {...props} >
    {#snippet mainSlot()}
        <slot />
    {/snippet}
    {#snippet copyrightSlot()}
        <slot name="copyright">
            <DefaultCopyright {copyrightText} {copyrightUrl} />
        </slot>
    {/snippet}
</PivFooter>