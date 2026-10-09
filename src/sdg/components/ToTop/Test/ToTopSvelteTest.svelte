<script>
    import ToTop from "../ToTop.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-to-top-svelte-test"}} />

<!-- Miroir EXACT de toTopBaselineTest.html : mêmes cas, même ordre.
     Le snapshot est partagé avec la fixture baseline (même {arg} = to-top.png),
     les deux rendus doivent donc être identiques au pixel près. -->

<!-- Bouton visible (mode démo), texte par défaut « Retour en haut » -->
<div class="cas cas-defaut" style="margin-block-end: var(--qc-spacer-md);">
    <ToTop demo="true" />
</div>

<!-- Bouton visible (mode démo), texte personnalisé -->
<div class="cas cas-texte" style="margin-block-end: var(--qc-spacer-md);">
    <ToTop demo="true" text="Revenir au sommet" />
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
