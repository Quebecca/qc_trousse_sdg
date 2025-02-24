<svelte:options customElement="qc-notice" />

<script>
  import { Utils } from "./utils"
  import { onMount } from "svelte";
  import Icon from "./Icon.svelte";

  const
      isFr = Utils.getPageLanguage() == 'fr'
    , defaultHeader = 'h2'
    , defaultType = 'neutral'
    , typesDescriptions = {
          'neutral' : isFr ? "Avis général" : "General notice"
        , 'information': isFr ? "Avis général" : "General notice"
        , 'warning': isFr ? "Avis d’avertissement" : "Warning notice"
        , 'success': isFr ? "Avis de réussite" : "Success notice"
        , 'error': isFr ? "Avis d’erreur" : "Error notice"
    }
    , types = Object.keys(typesDescriptions)
  export let
          title = ""
          , type = defaultType
          , content = ""
          , header = defaultHeader
          , icon
          , iconLabel = typesDescriptions[type] ?? typesDescriptions['information']

  onMount(() => {
    header = header.match(/h[1-6]/)
            ? header
            : defaultHeader
            ;
    type = types.includes(type)
            ? type
            : defaultType
            ;
  })
</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="qc-component qc-notice qc-{type}"
     tabindex="0">
  <div class="icon-container">
    <div class="qc-icon">
      <Icon type="{icon ?? (type == 'neutral' ? 'information' : type)}"
            label={iconLabel}
            size="nm"
      />
    </div>
  </div>
  <div class="content-container">
    <div class="content">
        {#if title}
          <svelte:element this={header}>
            {@html title}
          </svelte:element>
        {/if}
        {@html content}
        <slot />
    </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>
