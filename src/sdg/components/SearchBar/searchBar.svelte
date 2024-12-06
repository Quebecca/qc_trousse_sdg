<svelte:options customElement="{{
    tag: 'qc-search-bar',
    shadow: 'none',
    props: {
        value: {attribute: 'value', type:'String'},
        name: {attribute: 'value', type:'String'},
        ariaLabel: {attribute: 'aria-label', type:'String'},
        submitValue: {attribute: 'submit-value', type:'String'},
        submitName: {attribute: 'submit-value', type:'String'},
        submitText: {attribute: 'submit-text', type:'String'},
    }
}}" />

<script>
    import {Utils} from "../utils";
    import SearchInput from "./SearchInput.svelte";

    const
        lang = Utils.getPageLanguage()
    export let
        value = '',
        name = 'search',
        placeholder = lang === "fr"
            ? "Lancer la recherche"
            : "Submit search",
        ariaLabel = placeholder,
        submitValue,
        submitName,
        submitText
    ;


</script>
<div class="qc-search-bar">
    <SearchInput/>
    <div class="search-button">
    {#if true}
        {@const name = submitName}
        {@const value = submitValue}
        {@const text = submitText}
        <Button
                {name}
                {value}
                {text}
                icon="loupe-piv-fine"
        />
    {/if}
    </div>
</div>