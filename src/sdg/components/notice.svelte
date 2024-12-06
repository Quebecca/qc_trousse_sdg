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
            'information': isFr ? "Avis général" : "General notice"
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
          , iconLabel = typesDescriptions[type] ?? ''

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
      <svelte:element this={header}
                      class="title">
        {title}
      </svelte:element>
      <div class="text">
        {@html content}
        <slot />
      </div>
    </div>
  </div>
</div>
<style lang="scss">
  @each $type, $color in (
          "information": "blue",
          "warning": "yellow",
          "neutral": "grey",
          "error": "red",
          "success": "green",
  ) {
    .qc-notice.qc-#{$type} .icon-container {
      background-color: token-value(color,$color,pale);
      :global([role=img]) {
        background-color: token-value(color,$color,dark);
      }
    }
  }
</style>

<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>
