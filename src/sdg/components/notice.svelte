<svelte:options customElement="qc-notice" />

<script>
  import { Utils } from "./utils"
  import Icon from "./Icon.svelte";

  const
      isFr = Utils.getPageLanguage() == 'fr'
    , defaultHeader = 'h2'
    , defaultType = 'information'
    , typesDescriptions = {
          'advice': isFr ? "Avis conseil" : "Advisory notice",
          'note': isFr ? "Avis explicatif" : "Explanatory notice"
        , 'information': isFr ? "Avis général" : "General notice"
        , 'warning': isFr ? "Avis d’avertissement" : "Warning notice"
        , 'success': isFr ? "Avis de réussite" : "Success notice"
        , 'error': isFr ? "Avis d’erreur" : "Error notice"
    }
    , types = Object.keys(typesDescriptions);

  let noticeElement;
  export let
        title = ""
        , type = defaultType
        , content = ""
        , header = defaultHeader
        , icon;

    $: header = header.match(/h[1-6]/)
        ? header
        : defaultHeader;

    $: type = types.includes(type)
        ? type
        : defaultType;

    $: role = type === "success"
        ? "status"
        : (type === "error" ? "alert" : null);

  $: if (role) {
      if (noticeElement) {
          const tempNodes = Array.from(noticeElement.childNodes);
          console.log("temp: ",tempNodes);
          noticeElement.innerHTML = "";
          // Réinsère le contenu pour qu'il soit détecté par le lecteur d'écran.
          tempNodes.forEach(node => noticeElement.appendChild(node)); }
  }

    $: shouldUseIcon = type === "advice" || type === "note";
    // Si le type est "advice" ou "note", on force "neutral" (le gris), sinon on garde le type normal
    $: computedType = shouldUseIcon ? "neutral" : type;
    $: iconType = shouldUseIcon ? (icon ?? "note") : type;
    $: iconLabel = typesDescriptions[type] ?? typesDescriptions['information'];


</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="qc-component qc-notice qc-{computedType}"
     tabindex="0">
  <div class="icon-container">
    <div class="qc-icon">
      <Icon type="{iconType}"
            label={iconLabel}
            size="nm"
      />
    </div>
  </div>
  <div class="content-container">
    <div class="content" {role} bind:this={noticeElement}>
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
