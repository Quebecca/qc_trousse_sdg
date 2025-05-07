<svelte:options customElement="{{
    tag: 'qc-search-input',
    shadow: 'none',
    props: {
        ariaLabel: {attribute:'aria-label'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />
<script>
    import IconButton from "../Button/IconButton.svelte";
    import {Utils} from "../utils";
    const
        lang = Utils.getPageLanguage();

    export let
        value,
        ariaLabel = lang === "fr"
            ? "Rechercher…"
            : "Search_",
        clearAriaLabel = lang === "fr"
            ? "Effacer le texte"
            : "Clear text"
    ;
    let searchInput;

</script>
<div class="qc-search-input">
    <input  bind:this={searchInput}
            bind:value
            type="search"
            autocomplete="off"
            {...(ariaLabel ? {"aria-label": ariaLabel} : {})}
            {...$$restProps}
    />
    {#if value}
    <IconButton type="button"
                icon="clear-input"
                iconColor="blue-piv"
                iconSize="sm"
                aria-label={clearAriaLabel}
                on:click={e => {
                    e.preventDefault();
                    value = "";
                    searchInput.focus();
                }}
        />
    {/if}
</div>