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

    const lang = Utils.getPageLanguage();

    let {
        logoUrl = '/',
        fullWidth = 'false',
        logoSrc = Utils.imagesRelativePath + 'QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of government of Québec',
        titleUrl = '/',
        titleText = '',
        linksLabel = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation',
        altLanguageText = lang === 'fr' ? 'English' : 'Français',
        altLanguageUrl = '',
        joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us',
        joinUsUrl = '',
        goToContent = 'true',
        goToContentAnchor = '#main',
        goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content',
        displaySearchText = lang === 'fr' ? 'Cliquer pour faire une recherche' : 'Click to search',
        hideSearchText = lang === 'fr' ? 'Masquer la barre de recherche' : 'Hide search bar',
        enableSearch = 'false',
        showSearch = 'false'
    } = $props()

    let containerClass = $state('qc-container');
    let displaySearchForm = $state(false);

    export function focusOnSearchInput() {
        if (displaySearchForm) {
            document.querySelector('[slot="search-zone"] input')?.focus();
        }
    }

    onMount(() => {
      containerClass += fullWidth === 'true' ? '-fluid' : '';
      if (showSearch === 'true') {
        enableSearch = 'true'
        displaySearchForm = true;
      }
    });
</script>

<div role="banner"
     class="qc-piv-header qc-component"
     style="--logo-src:url({logoSrc})"
>
  <div class="{containerClass}">
    {#if goToContent === 'true'}
      <div class="go-to-content">
        <a href="{goToContentAnchor}">
          {goToContentText}
        </a>
      </div>
    {/if}

    <div class="piv-top">
        <div class="signature-group">
            <a href="{logoUrl}"
               class="logo"
               rel="noreferrer"
               aria-label="{logoAlt}"
            >
                <div role="img"></div>
            </a>

            {#if titleText}
                <div class="title">
                    <a href="{titleUrl}"
                       class="title">
                        {titleText}
                    </a>
                </div>

            {/if}
        </div>

      <div class="right-section">
        {#if enableSearch === 'true'}
          <a  class="qc-search"
              href="/"
              role="button"
              onclick = {(evt) => {
                  evt.preventDefault();
                  displaySearchForm = !displaySearchForm;
                  focusOnSearchInput();
              }}
          >
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
      {#if displaySearchForm}
      <div class="search-zone">
        <slot name="search-zone" />
      </div>
      {/if}
  </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>