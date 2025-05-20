<script>
    import IconButton from "../IconButton/IconButton.svelte";
    import {Utils} from "../utils";

    const lang = Utils.getPageLanguage();


    let {
        value = $bindable(''),
        ariaLabel = lang === "fr" ? "Rechercher…" : "Search_",
        clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text",
        ...rest
    } = $props();

    let searchInput;
</script>

<div class="qc-search-input">
    <input  bind:this={searchInput}
            bind:value={value}
            type="search"
            autocomplete="off"
            aria-label={ariaLabel}
            {...rest}
    />
    {#if value}
    <IconButton type="button"
                icon="clear-input"
                iconColor="blue-piv"
                iconSize="sm"
                aria-label={clearAriaLabel}
                onclick={(e) => {
                    e.preventDefault();
                    value = "";
                    searchInput?.focus();
                }}
        />
    {/if}
</div>