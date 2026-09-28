<script>
    import SearchBar from "../SearchBar.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-search-bar-svelte-test" }} />

<!-- Miroir Svelte de searchBarBaselineTest.html : même structure, mêmes variantes.
     Le rendu doit correspondre au pixel près au WC baseline (snapshot partagé). -->

<!-- Variante par défaut, dans un formulaire. -->
<div class="cas cas-defaut" style="margin-block-start: var(--qc-spacer-md); margin-block-end: var(--qc-spacer-md);">
    <form action="#">
        <SearchBar />
    </form>
</div>

<!-- Variante avec valeur pré-remplie : affiche le bouton d'effacement. -->
<div class="cas cas-valeur" style="margin-block-end: var(--qc-spacer-md);">
    <SearchBar value="Climat" />
</div>

<!-- Variante sur fond bleu PIV (prop pivBackground). -->
<div class="cas cas-piv"
     style="margin-block-end: var(--qc-spacer-md); padding: var(--qc-spacer-md); background-color: var(--qc-color-blue-piv);">
    <SearchBar pivBackground={true} />
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
