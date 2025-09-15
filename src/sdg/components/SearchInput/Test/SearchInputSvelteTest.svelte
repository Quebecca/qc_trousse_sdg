<script>
    import SearchInput from '../SearchInput.svelte';
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-search-input-svelte-test"}} />

<SearchInput
        placeholder="Rechercher un article"
        ariaLabel="Rechercher un article"
        clearAriaLabel="Effacer le texte"
        leftIcon="true"
/>

<br>

<SearchInput
        value="Climat"
        placeholder="Rechercher un sujet"
        ariaLabel="Rechercher un sujet"
        clearAriaLabel="Effacer le texte"
        leftIcon="true"
/>

<br>

<SearchInput
        placeholder="Recherche désactivée"
        ariaLabel="Recherche désactivée"
        clearAriaLabel="Effacer le texte"
        leftIcon="true"
        disabled="true"
/>

<link rel="stylesheet" href={Utils.cssPath}>