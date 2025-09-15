<script>
    import SearchBar from '../SearchBar.svelte';
    import {Utils} from "../../utils";
</script>

<svelte:options customElement={{tag: "qc-search-bar-svelte-test"}} />

<SearchBar />

<div style="margin: var(--qc-spacer-content-block-mb) 0 0;
                            padding: var(--qc-spacer-md);
                            background-color: var(--qc-color-blue-piv);">
    <SearchBar pivBackground="true" />
</div>

<link rel="stylesheet" href={Utils.cssPath} />