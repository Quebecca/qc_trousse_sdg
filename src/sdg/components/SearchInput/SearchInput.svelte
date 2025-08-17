<script>
    import IconButton from "../IconButton/IconButton.svelte";
    import {Utils} from "../utils";
    import Icon from "../Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();


    let {
        value = $bindable(''),
        ariaLabel = lang === "fr" ? "Rechercher..." : "Search...",
        clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text",
        leftIcon = false,
        ...rest
    } = $props();

    leftIcon = leftIcon === true || leftIcon === "true" || leftIcon === "";
    const isDisabled = rest.disabled === true || rest.disabled === "true" || rest.disabled === "";

    let searchInput;

    export function focus() {
        searchInput?.focus();
    }
</script>

<div class={[
        "qc-search-input",
        leftIcon && "qc-search-left-icon"]} >
    {#if leftIcon}
        <Icon type="loupe-piv-fine"
              iconColor="grey-regular"
        />
    {/if}
    <input  bind:this={searchInput}
            bind:value
            type="search"
            autocomplete="off"
            aria-label={ariaLabel}
            class={isDisabled ? "qc-disabled" : ""}
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