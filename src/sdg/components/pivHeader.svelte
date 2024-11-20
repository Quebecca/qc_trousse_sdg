<svelte:options customElement="{{
    tag: 'qc-piv-header'
  , props: {
      logoUrl : {attribute: 'logo-url'}
    , fullWidth : {attribute: 'full-width'}
    , logoSrc : {attribute: 'logo-src'}
    , logoAlt : {attribute: 'logo-alt'}
    , titleUrl : {attribute: 'title-url'}
    , titleText: {attribute: 'title-text'}
    , altLanguageText: {attribute: 'alt-language-text'}
    , altLanguageUrl: {attribute: 'alt-language-url'}
    , joinUsText: {attribute: 'join-us-text'}
    , joinUsUrl: {attribute: 'join-us-url'}
    , goToContent: {attribute: 'go-to-content'}
    , goToContentAnchor : {attribute: 'go-to-content-anchor'}
    , goToContentText: {attribute: 'go-to-content-text'}
    , searchPlaceholder : {attribute: 'search-placeholder'}
    , searchInputName : {attribute: 'search-input-name'}
    , submitSearchText : {attribute: 'submit-search-text'}
    , displaySearchText : {attribute: 'display-search-text'}
    , hideSearchText : {attribute: 'hide-search-text'}
    , searchFormAction : {attribute: 'search-form-action'}
    , enableSearch : {attribute: 'enable-search'}
    , showSearch : {attribute: 'show-search'}
  }
}}" />

<script>
import { onMount } from "svelte";
import { Utils } from "./utils"

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
      {#if titleText}
        <div class="title">
            <a href="{titleUrl}">
              <span>{titleText}</span>
            </a>
        </div>
      {/if}
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

<style lang="scss">
  @use "vendor/modern-css-reset/src/reset";
  @use "components/piv-header/pivHeaderSlots";
  //@use "components/icons" as *;

  :host {
    display: block;
    min-height: rem(72);
    background-color: token-value(color, blue, piv);
    width: 100%;
  }

  // Single container class with breakpoint max-widths
  .qc-container,
    // 100% wide container at all breakpoints
  .qc-container-fluid {
    @include make-container();
  }

  // Responsive containers that are 100% wide until a breakpoint
  @each $breakpoint, $container-max-width in $container-max-widths {
    .qc-container-#{$breakpoint} {
      @extend .qc-container-fluid;
    }

    @include media-breakpoint-up($breakpoint, $grid-breakpoints) {
      %responsive-container-#{$breakpoint} {
        max-width: $container-max-width;
      }

      // Extend each breakpoint which is smaller or equal to the current breakpoint
      $extend-breakpoint: true;

      @each $name, $width in $grid-breakpoints {
        @if ($extend-breakpoint) {
          .qc-container {
            @extend %responsive-container-#{$breakpoint};
          }

          // Once the current breakpoint is reached, stop extending
          @if ($breakpoint == $name) {
            $extend-breakpoint: false;
          }
        }
      }
    }
  }

  .qc-piv-header {
    color: token-value(color white);

    a {
      color: token-value(color white);
      text-decoration: none;

      &:hover, &:focus {
        color: token-value(color white);
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
        form {
          .input-group {
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: stretch;
            input {
              width: 100%;
              padding: rem(6) rem(12) ;
              border: 1px solid token-value(color blue dark);
              border-right: none;
              &:focus {
                outline: rem(2) solid token-value(color blue light);
                border-right: 1px solid black;
                z-index: 1;
              }
              &::placeholder {
                font-size: token-value(font size sm);
              }
            }
            button {
              display: flex;
              justify-content: center;
              border: 1px solid token-value(color blue dark);
              border-left: none;
              background-color: white;
              width: rem(2.6 * 16);
              &:focus{
                outline: rem(2) solid token-value(color blue light);
                border-left: 1px solid black;
              }
              .qc-search-submit {
                min-width: rem(24);
                height: rem(24);
                align-self: center;
              }
              .sr-description {
                position: absolute;
                width: 1px;
                height: 1px;
                clip: rect(0 0 0 0);
              }
            }

          }
        }
      }

    }
  }


  .go-to-content {
    display: flex;
    height: 0;

    a {
      @include sr-only();

      &:focus {
        width: inherit;
        height: inherit;
        overflow: inherit;
        clip: inherit;
        white-space: inherit;
        color: token-value(color white);
        background-color: token-value(color blue piv);
      }
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
