<script>
  import { Utils } from "../utils"
  import Icon from "../../bases/Icon/Icon.svelte";

  const isFr = Utils.getPageLanguage() === 'fr';
  const defaultHeader = 'h2';
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
      icon,
      slotContent
  } = $props();

  const types = Object.keys(typesDescriptions);

  const usedType = types.includes(type) ? type : defaultType;
  const usedHeader = header.match(/h[1-6]/) ? header : defaultHeader;
  const role = usedType === "success" ? "status" : (usedType === "error" ? "alert" : null);

  let noticeElement = $state(null);
  $effect(() => {
      if (role && noticeElement) {
          const tempNodes = Array.from(noticeElement.childNodes);
          noticeElement.innerHTML = "";

          // Réinsère le contenu pour qu'il soit détecté par le lecteur d'écran.
          tempNodes.forEach(node => noticeElement.appendChild(node));
      }
  });

  const shouldUseIcon = usedType === "advice" || usedType === "note";

    // Si le type est "advice" ou "note", on force "neutral" (le gris), sinon on garde le type normal
    const computedType = shouldUseIcon ? "neutral" : usedType;
    const iconType = shouldUseIcon ? (icon ?? "note") : usedType;
    const iconLabel = typesDescriptions[type] ?? typesDescriptions['information'];
</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->
<!--Le warning `Svelte: noninteractive element cannot have nonnegative tabIndex value`
associe a tabindex="0" doit etre ignore pour qu'on puisse focus sur le composant sans
le denaturaliser.-->

<!-- svelte-ignore a11y_no_noninteractive_tabindex -->
<div class="qc-component qc-notice qc-{computedType}"
     tabindex="0"
     >
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
        {#if title && title !== ""}
          <svelte:element this={usedHeader}>
            {@html title}
          </svelte:element>
        {/if}

        {@html content}

        {@render slotContent?.()}
    </div>
  </div>
</div>

<style lang="scss">
  @use "../../scss/qc-sdg-lib" as *;
  @use "sass:list" as *;

  //@mixin qc-notice-title() {
  //  h1,h2,h3,h4,h5,h6,[role=heading] {
  //    margin: 0;
  //    padding: 0;
  //    @include content-font(sm, bold);
  //    font-family: token-value(font, family, content);
  //  }
  //}

  .qc-notice {
    max-inline-size: token-value(max-content-width);
    display: flex;
    border: 1px solid token-value(color,grey,light);
    background-color: token-value(color,white);
    word-break: break-word;
    @include content-font(sm);


    .icon-container {
      display: flex;
      padding: token-value(spacer, md) token-value(spacer, xs);
      background-color: token-value(color,blue,pale);

      .qc-icon {
        background-size: 100% auto;
        min-width: token-value(spacer, md);
        height: token-value(spacer, md);
      }
    }
    .content-container {
      width: 100%;
    }

    @include qc-notice-title();

    //TODO Quelle est la marge entre le titre et le texte? Rien de spécifié dans le SDG.


    .content {
      margin:
              token-value(spacer md)
              token-value(spacer md)
              token-value(spacer md)
              token-value(spacer, sm);
    }

    @each $type, $color in (
            "information": ("blue", "piv"),
            "warning": ("yellow" , "dark"),
            "neutral": ("grey", "dark"),
            "error": ("red", "regular"),
            "success": ("green","regular"),
    ) {
      &.qc-#{$type} .icon-container {
        background-color: token-value(color, nth($color, 1), pale);
        [role=img] {
          background-color: token-value(color,nth($color, 1), nth($color, 2));
        }
      }
    }
  }

  // Links in a error notice (eg. error summary)
  :global(qc-notice) {
    display: block;
    @include qc-notice-title();
    ul {
      padding-left: token-value(spacer, sm) !important;
      //margin-top: token-value(spacer, sm) !important;
    }
    &[type="error"] ul li {
      &::marker {
        color:token-value(color text primary);
      }
      color: token-value(color, red, regular);
      a {
        color: inherit;
        &:hover, &:focus {
          text-decoration: none;
        }
      }
    }
    margin-bottom: rem(4 * $base-spacer);

  }
</style>
