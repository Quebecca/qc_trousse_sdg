<svelte:options customElement="{{
    tag: 'qc-search-bar',
    shadow: 'none',
    props: {
        value: {attribute: 'value', type:'String'},
        name: {attribute: 'value', type:'String'},
        ariaLabel: {attribute: 'aria-label', type:'String'},
        submitValue: {attribute: 'submit-value', type:'String'},
        submitName: {attribute: 'submit-value', type:'String'},
        submitSrText: {attribute: 'submit-text', type:'String'},
        pivBackground: {attribute: 'piv-background', type:'Boolean'},
    }
}}" />

<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import IconButton from "../Button/IconButton.svelte";
    import {onMount} from "svelte";

    const
        lang = Utils.getPageLanguage()
    export let
        value = '',
        name = 'q',
        placeholder = lang === "fr"
            ? "Rechercher…"
            : "Search_",
        ariaLabel = placeholder,
        submitValue,
        submitName,
        submitSrText = lang === "fr"
            ? "Lancer la recherche"
            : "Submit search",
        pivBackground = false
    ;

    let root;
    onMount(() => {
        const pivHeaderBg = getComputedStyle(root.parentNode)
                            .getPropertyValue('--qc-piv-header-bg');
        console.log('--qc-piv-header-bg', pivBackground)

    })


</script>
<div bind:this={root}
        class="qc-search-bar"
        class:piv-background={pivBackground}
    >
    <SearchInput {value}
                 {name}
                 {ariaLabel}
    />
    {#if true}
        {@const name = submitName}
        {@const value = submitValue}
        {@const srText = submitSrText}
        <IconButton
                type="submit"
                {name}
                {value}
                {srText}
                iconColor={pivBackground ? 'blue-piv' : 'background'}
                icon="loupe-piv-fine"
                iconSize="md"
        />
    {/if}
</div>