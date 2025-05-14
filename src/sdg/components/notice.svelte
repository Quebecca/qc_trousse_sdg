<svelte:options customElement="qc-notice" />

<script>
  import { Utils } from "./utils"
  import Icon from "./Icon.svelte";

  const isFr = Utils.getPageLanguage() === 'fr';
  const defaultHeader = 'h2'
  const defaultType = 'information';
  const typesDescriptions = {
      'advice': isFr ? "Avis conseil" : "Advisory notice",
      'note': isFr ? "Avis explicatif" : "Explanatory notice",
      'information': isFr ? "Avis général" : "General notice",
      'warning': isFr ? "Avis d’avertissement" : "Warning notice",
      'success': isFr ? "Avis de réussite" : "Success notice",
      'error': isFr ? "Avis d’erreur" : "Error notice"
  };

  let {
      title = "",
      type = defaultType,
      content = "",
      header = defaultHeader,
      icon
  } = $props();

  const types = Object.keys(typesDescriptions);

  const usedType = types.includes(type) ? type : defaultType;
  const usedHeader = header.match(/h[1-6]/) ? header : defaultHeader;
  const role = usedType === "success" ? "status" : (usedType === "error" ? "alert" : null);

  let noticeElement;
  if (role && noticeElement) {
      const tempNodes = Array.from(noticeElement.childNodes);
      noticeElement.innerHTML = "";

      // Réinsère le contenu pour qu'il soit détecté par le lecteur d'écran.
      tempNodes.forEach(node => noticeElement.appendChild(node));
  }

  const shouldUseIcon = type === "advice" || type === "note";

    // Si le type est "advice" ou "note", on force "neutral" (le gris), sinon on garde le type normal
    const computedType = shouldUseIcon ? "neutral" : type;
    const iconType = shouldUseIcon ? (icon ?? "note") : type;
    const iconLabel = typesDescriptions[type] ?? typesDescriptions['information'];
</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->

<div class="qc-component qc-notice qc-{computedType}" tabindex="0">
  <div class="icon-container">
    <div class="qc-icon">
      <Icon type={iconType}
            label={iconLabel}
            size="nm"
      />
    </div>
  </div>

  <div class="content-container">
    <div class="content" {role} bind:this={noticeElement}>
        {#if title}
          <svelte:element this={usedHeader}>
            {@html title}
          </svelte:element>
        {/if}
        {@html content}
        <slot />
    </div>
  </div>
</div>
<link rel='stylesheet' href='{Utils.cssPath}'>
