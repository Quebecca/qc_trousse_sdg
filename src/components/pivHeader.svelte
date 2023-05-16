<svelte:options tag="qc-piv-header" />

<script>
import { onMount } from "svelte";
import { Utils } from "./utils"
import { get_current_component } from "svelte/internal"  

export let
    logoUrl= '/'
  , fullWidth = 'false'
  , logoSrc = `${Utils.imagesRelativePath}qc-sprite.svg?v=_vSDG_#QUEBEC_blanc`
  , logoAlt = Utils.getPageLanguage() === 'fr'
                ? 'Logo du gouvernement du Québec'
                : 'Logo of government of Québec'
  , titleUrl= '/'
  , titleText= ''
  , altLanguageText= Utils.getPageLanguage() === 'fr'
                        ? 'English'
                        : 'Français'
  , altLanguageUrl= ''
  , joinUsText= Utils.getPageLanguage() === 'fr'
                  ? 'Nous joindre'
                  : 'Contact us'
  , joinUsUrl= ''
  , goToContent = 'true'
  , goToContentAnchor= '#main'
  , goToContentText= Utils.getPageLanguage() === 'fr'
                      ? 'Passer au contenu'
                      : 'Skip to content'

let   slots = []
    , mounted = false
    , containerClass = 'qc-container'
;
const thisComponent = get_current_component()

onMount(() => {  
  slots = Array.from(thisComponent.querySelectorAll('[slot]'))    
  mounted = true
  containerClass += fullWidth === 'true' ? '-fluid' : '';
  Utils.refreshAfterUpdate(thisComponent)
})
</script>

<div class="qc-piv-header qc-component"
     class:qc-d-none={!mounted}>
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
