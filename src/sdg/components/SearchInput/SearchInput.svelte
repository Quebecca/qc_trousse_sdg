<svelte:options customElement="{{
    tag: 'qc-search-input',
    shadow: 'none'
}}" />
<script>
    import IconButton from "../Button/IconButton.svelte";
    export let value, ariaLabel;
    let searchInput;
</script>
<div class="qc-search-input">
    <input  bind:this={searchInput}
            bind:value
            type="search"
            class="control"
            autocomplete="off"
            {...$$restProps}
    />
    {#if value}
    <IconButton type="button"
                icon="clear-input"
                iconColor="blue-piv"
                iconSize="sm"
                on:click={e => {
                    e.preventDefault();
                    value = "";
                    searchInput.focus();
                }}
        />
    {/if}
</div>