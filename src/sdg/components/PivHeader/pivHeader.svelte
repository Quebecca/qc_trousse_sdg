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
import { onMount } from "svelte";
import { Utils } from "../utils"
import SearchBar from "../SearchBar/searchBar.svelte";

const
  lang = Utils.getPageLanguage()

export let
    logoUrl= '/'
  , fullWidth = 'false'
  , logoSrc = Utils.imagesRelativePath + 'quebec-logo.svg'
  , logoAlt = lang === 'fr'
      ? 'Logo du gouvernement du Québec'
      : 'Logo of government of Québec'
  , titleUrl= '/'
  , titleText= ''
  , linksLabel= lang === 'fr'
          ? 'Navigation PIV'
          : 'PIV navigation'
  , altLanguageText= lang === 'fr'
                  ? 'English'
                  : 'Français'
  , altLanguageUrl= ''
  , joinUsText= lang === 'fr'
                  ? 'Nous joindre'
                  : 'Contact us'
  , joinUsUrl= ''
  , goToContent = 'true'
  , goToContentAnchor = '#main'
  , goToContentText= lang === 'fr'
      ? 'Passer au contenu'
      : 'Skip to content'
  , displaySearchText =  lang === 'fr'
          ? 'Cliquer pour faire une recherche'
          : 'Click to search'
  , hideSearchText =  lang === 'fr'
          ? 'Masquer la barre de recherche'
          : 'Hide search bar'
  , enableSearch = 'false'
  , showSearch = 'false'

export function focusOnSearchInput() {
  if (displaySearchForm) {

  }
}

let
    containerClass = 'qc-container'
  , displaySearchForm = false
;

onMount(() => {
  containerClass += fullWidth === 'true' ? '-fluid' : '';
  if (showSearch === 'true') {
    enableSearch = 'true'
    displaySearchForm = true;
  }
})


</script>

<div role="banner"
     class="qc-piv-header qc-component"
>
  <div class="{containerClass}">
    {#if goToContent == 'true'}
      <div class="go-to-content">
        <a href="{goToContentAnchor}">
          {goToContentText}
        </a>
      </div>
    {/if}
    <div class="piv-top">
      <div class="logo">
        <a href="{logoUrl}"
           target="_blank"
           rel="noreferrer">
          <img alt="{logoAlt}"
               src="{logoSrc}">
        </a>
      </div>
      {#if titleText}
        <div class="title">
          <a href="{titleUrl}">
            <span>{titleText}</span>
          </a>
        </div>
      {/if}
      <div class="right-section">
        {#if enableSearch == 'true'}
          <a  class="qc-search"
              href="/"
              role="button"
              on:click|preventDefault = {() => displaySearchForm = !displaySearchForm}
              on:click ={focusOnSearchInput}>
            <span>{displaySearchForm ? hideSearchText : displaySearchText}</span>
          </a>
        {/if}
        <div class="links">
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
        </div>
      </div>
    </div>
    <div class="piv-bottom">
      {#if titleText}
        <div class="title">
            <a href="{titleUrl}">
              <span>{titleText}</span>
            </a>
        </div>
      {/if}
      {#if displaySearchForm}
      <div class="search-zone">
        <slot name="search-zone" />
      </div>
      {/if}
  </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>