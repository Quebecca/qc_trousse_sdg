<script>
    import SearchInput from "../SearchInput.svelte";
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-search-input-svelte-test" }} />

<SearchInput
        placeholder="Sans debounce"
        ariaLabel="Recherche sans debounce"
        clearAriaLabel="Effacer le texte"
        leftIcon={true}
/>

<br>

<SearchInput
        placeholder="Avec debounce"
        ariaLabel="Recherche avec debounce"
        clearAriaLabel="Effacer le texte"
        debounce={300}
        leftIcon={true}
/>

<link rel='stylesheet' href='{Utils.cssPath}'>
