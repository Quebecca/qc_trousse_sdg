<script>
    import IconButton from "../IconButton/IconButton.svelte";
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    import Label from "../Label/Label.svelte";
    import { onDestroy, untrack } from "svelte";

    const lang = Utils.getPageLanguage();

    let {
        value = $bindable(''),
        label = '',
        size = '',
        debounce = 0,
        ariaLabel = lang === "fr" ? "Rechercher..." : "Search...",
        clearAriaLabel = lang === "fr" ? "Effacer le texte" : "Clear text",
        leftIcon = false,
        id = `qc-search-input-${Math.random().toString(36).slice(2, 11)}`,
        ...rest
    } = $props();

    const leftIconNormalized = $derived(leftIcon === true || leftIcon === "true" || leftIcon === "");
    const isDisabled = $derived(rest.disabled === true || rest.disabled === "true" || rest.disabled === "");

    let searchInput;

    // Valeur interne liée à l'input — toujours synchrone avec la saisie
    let inputValue = $state(value ?? '');
    let timer;

    // Synchroniser inputValue quand value change de l'extérieur (clear, reset)
    // untrack sur inputValue pour ne réagir qu'aux changements de `value`
    $effect(() => {
        const v = value ?? '';
        if (v !== untrack(() => inputValue)) {
            inputValue = v;
        }
    });

    function handleInput() {
        if (debounce > 0) {
            clearTimeout(timer);
            timer = setTimeout(() => {
                value = inputValue;
                searchInput?.dispatchEvent(new CustomEvent('qc-change', { bubbles: true, detail: value }));
            }, debounce);
        } else {
            value = inputValue;
        }
    }

    function clearValue(e) {
        e.preventDefault();
        clearTimeout(timer);
        inputValue = "";
        value = "";
        searchInput?.dispatchEvent(new CustomEvent('qc-change', { bubbles: true, detail: value }));
        searchInput?.focus();
    }

    onDestroy(() => clearTimeout(timer));

    export function focus() {
        searchInput?.focus();
    }
</script>

{#if label}
    <Label
        disabled={isDisabled}
        text={label}
        forId={id}
    />
{/if}
<div class={[
            "qc-search-input",
            leftIconNormalized && "qc-search-left-icon",
            leftIconNormalized && isDisabled && "qc-search-left-icon-disabled"
        ]}
     size={size}>

    {#if leftIconNormalized}
        <Icon type="search-thin"
              iconColor="grey-regular"
              class={`qc-icon${isDisabled ? ' is-disabled' : ''}`}
        />
    {/if}
    <input  bind:this={searchInput}
            bind:value={inputValue}
            oninput={handleInput}
            type="search"
            autocomplete="off"
            aria-label={label ? undefined : ariaLabel}
            class={isDisabled ? "qc-disabled" : ""}
            id={id}
            {...rest}
    />
    {#if inputValue}
    <IconButton type="button"
                icon="xclose"
                iconColor="blue-piv"
                iconSize="sm"
                aria-label={clearAriaLabel}
                onclick={clearValue}
        />
    {/if}
</div>
