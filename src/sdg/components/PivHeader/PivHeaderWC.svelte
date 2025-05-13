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
    import { Utils } from "../utils";
    import PivHeader from "./PivHeader.svelte";
    import DefaultLinks  from "./_defaultLinks.svelte";

    const lang = Utils.getPageLanguage();

    let {
        self,
        joinUsText,
        joinUsUrl,
        altLanguageText,
        altLanguageUrl,
        linksLabel,
        ...props
    } = $props()

</script>

<PivHeader {self} {...props}>
    {#snippet links()}
        <slot name="links">
            <DefaultLinks {joinUsUrl}
                          {joinUsText}
                          {altLanguageUrl}
                          {altLanguageText}
                          {linksLabel}/>
        </slot>
    {/snippet}

    {#snippet search()}
        <slot name="search-zone" />
    {/snippet}
</PivHeader>
