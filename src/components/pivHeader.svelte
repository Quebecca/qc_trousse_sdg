<svelte:options tag="qc-piv-header" />

<script>
import { onMount } from "svelte";
import { Utils } from "./utils"

const
  lang = Utils.getPageLanguage()

export let
    logoUrl= '/'
  , fullWidth = 'false'
  , logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=_vSDG_#QUEBEC_blanc`
  , logoAlt = lang === 'fr'
      ? 'Logo du gouvernement du Québec'
      : 'Logo of government of Québec'
  , titleUrl= '/'
  , titleText= ''
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
  , searchPlaceholder =  lang === 'fr'
      ? 'Rechercher…'
      : 'Search…'
  , searchInputName =  'q'
  , submitSearchText =  lang === 'fr'
      ? 'Rechercher'
      : 'Search'
  , displaySearchText =  lang === 'fr'
          ? 'Cliquer pour faire une recherche'
          : 'Click to search'
  , hideSearchText =  lang === 'fr'
          ? 'Masquer la barre de recherche'
          : 'Hide search bar'
  , searchFormAction =  '#'
  , enableSearch = 'false'
  , showSearch = 'false'

export function focusOnSearchInput() {
  if (displaySearchForm) {
    searchInput.focus()
  }
}

let
    containerClass = 'qc-container'
  , displaySearchForm = false
  , searchInput
;

onMount(() => {
  containerClass += fullWidth === 'true' ? '-fluid' : '';
  if (showSearch === 'true') {
    enableSearch = 'true'
    displaySearchForm = true;
  }
})


</script>

<div class="qc-piv-header qc-component">
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
      <div class="title">
        <slot name="title">
          {#if titleText}
          <a href="{titleUrl}">
            <span>{titleText}</span>
          </a>
          {/if}
        </slot>
      </div>
      <div class="right-section">
        {#if enableSearch == 'true'}
          <a  class="qc-icon qc-search"
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
              <ul>
                {#if altLanguageUrl}
                  <li><a href="{altLanguageUrl}">{altLanguageText}</a></li>
                {/if}
                {#if joinUsUrl}
                  <li><a href="{joinUsUrl}">{joinUsText}</a></li>
                {/if}
              </ul>
          {/if}
          </slot>
        </div>
      </div>
    </div>
    <div class="piv-bottom">
      <div class="title">
        <slot name="title">
          {#if titleText}
            <a href="{titleUrl}">
              <span>{titleText}</span>
            </a>
          {/if}
        </slot>
      </div>
      {#if displaySearchForm}
      <div class="search-zone">
        <slot name="search-zone">
          <form method="get"
                action="{searchFormAction}">
            <div class="input-group">
              <input type="text"
                     bind:this = {searchInput}
                     placeholder="{searchPlaceholder}"
                     name="{searchInputName}">
              <button>
                <span class="qc-icon qc-search-submit" />
                <span class="sr-description">{submitSearchText}</span>
              </button>
            </div>
          </form>
        </slot>
      </div>
      {/if}
  </div>
  </div>
</div>

<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>
