<!-- 
Required tag for svelte to know were building a custom element.
-->
<svelte:options tag="qc-notice" />

<script>
  import { Utils } from "./utils"
  export let title = ""
  export let type = "information"
  export let content = ""
</script>

<!-- TODO Confirmer tabindex. On pense que c'est important de recevoir le focus (notamment dans les formulaires) en fait pour nous c'est très important, sinon en mode formulaire au lecteur écran (nav avec TAB, ce n'est jamais lu). -->
<!-- svelte-ignore a11y-no-noninteractive-tabindex -->
<div class="qc-component qc-notice {type}" tabindex="0">
  <div class="icon-container">
    <div aria-hidden="true" class="qc-icon {type}"></div>
  </div>
  <div class="content">
    <!-- TODO Confirmer qu'on veut un header. Si oui, possibilité de spécifier le niveau? -->
    <h2 class="title">
      {title}
    </h2>
    <div class="text">
      {#if content}
        {@html content}      
      {/if}
      <slot />
      <slot name="content" />
    </div>
  </div>
</div>

<!-- TODO Ici on fait quoi? on doit connaître le fichier css à utiliser, et là il y a plusieurs possibilités (on devrait en avoir un seul à mon avis. Pas grave si on ne veut pas la grille mais que le css est là. C'est plus simple, 1 css pour les dominer tous. Le poids ne fera pas une énorme différence) -->
<link rel='stylesheet' href='{Utils.cssRelativePath}{Utils.cssFileName}'>
