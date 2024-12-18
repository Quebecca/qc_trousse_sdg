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

<style lang="scss">
  @use "../../scss/vendor/modern-css-reset/src/reset.css";
  @use "../../scss/components/piv-header/pivHeaderSlots";

  .qc-container,
  .qc-container-fluid
  {
    width: 100%;
    padding-right: calc(1 * var(--qc-grid-gutter) / 2);
    padding-left: calc(1 * var(--qc-grid-gutter) / 2);
    margin-right: auto;
    margin-left: auto;
  }

  @each $breakpoint, $media-width in map-get($lg-tokens, grid, breakpoint) {
    @media (min-width: $media-width) {
      .qc-container {
        max-width: map-get($lg-tokens, grid, container-max-width, $breakpoint);
      }
    }
  }

  .qc-piv-header {
    color: map-get($colors, white);
    .go-to-content {
     position: relative;
    }
    a {
      color: map-get($colors, white);
      text-decoration: none;

      &:hover, &:focus {
        color: map-get($colors, white);
        text-decoration: underline;
      }
    }

    .piv-top {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .logo {
        margin-right: rem(64);
        @include media-mobile() {
          margin: 0;
        }

        a {
          display: block;
        }

        img {
          height: rem(72);
          min-width: rem(200);
        }
      }

      .title {
        width: 100%;
        padding: token-value(spacer sm) 0;
        min-height: rem(72);
        align-items: center;
        display: flex;
        margin-right: rem(40);

        a {
          @include content-font(100);
          font-family: token-value(font, family, header);

          &:hover, &:focus {
            text-decoration: underline;
          }

          .description {
            font-size: token-value(font size sm);
          }
        }
      }

      .right-section {
        min-width: fit-content;
        display: flex;
        align-items: center;

        .links ul {
          @extend %piv-links;
        }

        @include media-mobile() {
          min-width: auto;
        }
      }

      .qc-search {
        background-image: getImageUrl(loupe-piv-droite);
        min-width: rem(24);
        height: rem(24);
        span {
          @include sr-only();
        }
      }
    }

    .piv-bottom {
      .title {
        display: none;
      }
      .search-zone {
        padding-bottom: token-value(spacer md);
      }
    }
  }


  .go-to-content {
    display: flex;
    height: 0;

    a {
      @include sr-only();

      &:focus {
        top: 2px;
        width: inherit;
        height: 24px;
        overflow: inherit;
        clip: inherit;
        white-space: inherit;
        color: map-get($colors, white);
        background-color: map-get($colors, blue, piv);
        margin:0;
      }
    }
  }
  a:focus-visible {
      --qc-color-link-focus-outline: white;
      @include focus-link();
    &:has(img) {
      outline-offset: -2px;
    }
  }


  @include media-tablet() {
    .qc-piv-header {
      .piv-top {
        .logo img {
          min-width: rem(175);
          width: rem(175);
        }

        .title {
          display: none;
        }

        .right-section {
          min-width: rem(130);
        }
      }

      .piv-bottom {
        .title {
          margin: 0;
          display: flex;
          padding-bottom: token-value(spacer sm);
          @include content-font(100);
          font-family: token-value(font, family, header);
        }
      }
    }
  }

  @include media-mobile() {
    .qc-piv-header {
      .piv-top {
        height: rem(72);

        .right-section {
          min-width: fit-content;
        }
      }
    }
  }


</style>
