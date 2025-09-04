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
    import PivHeader from "./PivHeader.svelte";
    import { Utils } from "../utils"

    let {
        self,
        ...props
    } = $props()

</script>

<PivHeader customElementParent={self}
           {...props}
           slots={$$slots} >
    {#snippet linksSlot()}
        <slot name="links" />
    {/snippet}
    {#snippet searchZoneSlot()}
        <slot name="search-zone" />
    {/snippet}
</PivHeader>
<link rel='stylesheet' href='{Utils.cssPath}'>

