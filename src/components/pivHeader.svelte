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
  , goToContentAnchor= '#main'
  , goToContentText= lang === 'fr'
                      ? 'Passer au contenu'
                      : 'Skip to content'

let  containerClass = 'qc-container'
;


onMount(() => {
  containerClass += fullWidth === 'true' ? '-fluid' : '';
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
        <a href="{logoUrl}">
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
        <slot name="search-button" />
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
      <div class="search-zone">
        <slot name="search-zone" />
      </div>
  </div>
  </div>
</div>

<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>
