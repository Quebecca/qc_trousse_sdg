<script>
    import IconButton from "../IconButton/IconButton.svelte";
    import {Utils} from "../utils";
    import Icon from "../Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();


    let {
        value = $bindable(''),
        ariaLabel = lang === "fr" ? "Rechercher…" : "Search_",
        clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text",
        liveRefresh = false,
        ...rest
    } = $props();

    let searchInput;
</script>

<div class={["qc-search-input", liveRefresh && "qc-search-live-refresh"]}>
    {#if liveRefresh}
        <Icon type="loupe-piv-fine" iconColor="grey-regular" />
    {/if}
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