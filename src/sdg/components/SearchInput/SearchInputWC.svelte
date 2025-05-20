<svelte:options customElement="{{
    tag: 'qc-search-input',
    shadow: 'none',
    props: {
        ariaLabel: {attribute:'aria-label'},
        clearAriaLabel: {attribute: 'clear-aria-label'}
    }
}}" />

<script>
    import SearchInput from "./SearchInput.svelte";

    const props = $props();
</script>

<SearchInput {...props} />