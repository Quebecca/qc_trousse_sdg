<script>
    import { onMount, tick } from "svelte";
    import { Utils } from "../utils"
    import DefaultLinks from "./_defaultLinks.svelte"

    const lang = Utils.getPageLanguage();

    let {
        self,
        logoUrl = '/',
        fullWidth = 'false',
        logoSrc = Utils.imagesRelativePath + 'QUEBEC_blanc.svg',
        logoAlt = lang === 'fr' ? 'Logo du gouvernement du Québec' : 'Logo of government of Québec',
        titleUrl = '/',
        titleText = '',
        linksLabel,
        altLanguageText,
        altLanguageUrl,
        joinUsText,
        joinUsUrl,
        goToContent = 'true',
        goToContentAnchor = '#main',
        goToContentText = lang === 'fr' ? 'Passer au contenu' : 'Skip to content',
        displaySearchText = lang === 'fr' ? 'Cliquer pour faire une recherche' : 'Click to search',
        hideSearchText = lang === 'fr' ? 'Masquer la barre de recherche' : 'Hide search bar',
        enableSearch = 'false',
        showSearch = 'false',
        links,
        search
    } = $props()
    console.log('PivHeader self', self);
    let containerClass = $state('qc-container')
        , searchZone = $state(null)
        , displaySearchForm = $state(false);

    // $effect(_ => {
    //     if (displaySearchForm) {
    //         let input = self
    //             ? self.querySelector('[slot="search-zone"] input')
    //             : searchZone.querySelector('input')
    //         ;
    //         input?.focus();
    //     }
    // })
    $inspect(self)

    function focusOnSearchInput() {

        if (displaySearchForm) {

            let input = self
                ? self.querySelector('[slot="search-zone"] input')
                : searchZone.querySelector('input')
            ;
            console.log('focusOnSearchInput', self, searchZone, input );
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
            {#if links}
                {@render links()}
<!--            Le bloc else est present uniquement pour le cas ou PivHeader est utilise sans le wrapper PivHeaderWC.svelte -->
            {:else}
                <DefaultLinks {joinUsUrl}
                              {joinUsText}
                              {altLanguageUrl}
                              {altLanguageText}
                              {linksLabel}/>
            {/if}
        </div>
      </div>
    </div>

    <div class="piv-bottom">
      {#if displaySearchForm}
          <div class="search-zone" bind:this={searchZone}>
              {@render search?.()}
          </div>
      {/if}
  </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>