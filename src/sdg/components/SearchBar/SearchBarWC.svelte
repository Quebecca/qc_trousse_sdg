<svelte:options customElement="{{
    tag: 'qc-search-bar',
    shadow: 'none',
    props: {
        value: {attribute: 'input-value', type:'String'},
        name: {attribute: 'input-name', type:'String'},
        pivBackground: {attribute: 'piv-background', type:'Boolean'},
    }
}}" />

<script>
    import SearchBar from "./SearchBar.svelte";

    const props = $props();
</script>

<SearchBar {...props} />