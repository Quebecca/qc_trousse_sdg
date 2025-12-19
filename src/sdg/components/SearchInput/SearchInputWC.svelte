<svelte:options customElement="{{
    tag: 'qc-search-input',
    shadow: 'none',
    props: {
        id: {attribute: 'id'},
        ariaLabel: {attribute:'aria-label'},
        clearAriaLabel: {attribute: 'clear-aria-label'},
        label: {attribute: 'label'},
        size: {attribute: 'size'},
        leftIcon: {attribute: 'left-icon'}
    }
}}" />

<script>
    import SearchInput from "./SearchInput.svelte";

    const props = $props();
</script>

<SearchInput {...props} />