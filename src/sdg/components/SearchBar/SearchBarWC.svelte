<svelte:options customElement="{{
    tag: 'qc-search-bar',
    shadow: 'none',
    props: {
        value: {attribute: 'input-value', type:'String'},
        name: {attribute: 'input-name', type:'String'},
        pivBackground: {attribute: 'piv-background', type:'Boolean'},
        invalid: {attribute: 'invalid', type:'Boolean'},
        invalidText: {attribute: 'invalid-text', type:'String'},
    }
}}" />

<script>
    import SearchBar from "./SearchBar.svelte";

    const props = $props();
</script>

<SearchBar {...props} />