<script>
    import IconButton from "../IconButton/IconButton.svelte";
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";

    const lang = Utils.getPageLanguage();


    let {
        value = $bindable(''),
        ariaLabel = lang === "fr" ? "Rechercher..." : "Search...",
        clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text",
        leftIcon = false,
        id = `qc-search-input-${Math.random().toString(36).slice(2, 11)}`,
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
            leftIcon && "qc-search-left-icon",
            leftIcon && isDisabled && "qc-search-left-icon-disabled"
        ]} >
    {#if leftIcon}
        <Icon type="search-thin"
              iconColor="grey-regular"
              class={`qc-icon${isDisabled ? ' is-disabled' : ''}`}
        />
    {/if}
    <input  bind:this={searchInput}
            bind:value
            type="search"
            autocomplete="off"
            aria-label={ariaLabel}
            class={isDisabled ? "qc-disabled" : ""}
            id={id}
            {...rest}
    />
    {#if value}
    <IconButton type="button"
                icon="xclose"
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