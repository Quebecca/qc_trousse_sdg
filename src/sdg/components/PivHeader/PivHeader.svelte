<script>
    import { onMount, tick } from "svelte";
    import { Utils } from "../utils"

    const lang = Utils.getPageLanguage();

    let {
        customElementParent,
        logoUrl = '/',
        fullWidth = 'false',
        logoSrc = Utils.imagesRelativePath + 'QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of government of Québec',
        titleUrl = '/',
        titleText = '',
        joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us',
        joinUsUrl = '',
        altLanguageText = lang === 'fr' ? 'English' : 'Français',
        altLanguageUrl = '',
        linksLabel = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation',
        goToContent = 'true',
        goToContentAnchor = '#main',
        goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content',
        displaySearchText = lang === 'fr' ? 'Cliquer pour faire une recherche' : 'Click to search',
        hideSearchText = lang === 'fr' ? 'Masquer la barre de recherche' : 'Hide search bar',
        enableSearch = 'false',
        showSearch = 'false',
        linksSlot,
        searchZoneSlot,
        slots = false
    } = $props()

    let containerClass = $state('qc-container')
        , searchZone = $state(null)
        , displaySearchForm = $state(false)
    ;

    function focusOnSearchInput() {

        if (displaySearchForm) {
            let input = customElementParent
                ? customElementParent.querySelector('[slot="search-zone"] input')
                : searchZone.querySelector('input')
            ;
            input?.focus();
        }
    }

    onMount(() => {
      containerClass += fullWidth === 'true' ? '-fluid' : '';
      if (showSearch === 'true') {
        enableSearch = 'true'
        displaySearchForm = true;
      }
    });

    $inspect("piv header slots", slots)
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
            <div
               class="logo"
            >
                <a href="{logoUrl}"
                   rel="noreferrer"
                   aria-label="{logoAlt}"
                    >
                    <div role="img"></div>
                </a>

            </div>

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
        {#if Utils.isTruthy(enableSearch)}
          <a  class="qc-search"
              href="/"
              role="button"
              onclick = {(evt) => {
                  evt.preventDefault();
                  displaySearchForm = !displaySearchForm;
                  tick().then(() => {
                            focusOnSearchInput()
                    });
              }}
          >
            <span>{displaySearchForm ? hideSearchText : displaySearchText}</span>
          </a>
        {/if}
        <div class="links">
            {#if (!slots || slots['links']) && linksSlot }
                {@render linksSlot()}
<!--            Le bloc else est present uniquement pour le cas ou PivHeader est utilise sans le wrapper PivHeaderWC.svelte -->
            {:else}
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
            {/if}
        </div>
      </div>
    </div>

    <div class="piv-bottom">
      {#if displaySearchForm}
          <div class="search-zone" bind:this={searchZone}>
              {#if searchZoneSlot}
                {@render searchZoneSlot()}
              {/if}
          </div>
      {/if}
  </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>