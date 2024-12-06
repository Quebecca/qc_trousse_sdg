<svelte:options customElement="{{
    tag: 'qc-search-input',
    shadow: 'none',
    props: {
        value: {attribute:'value'},
        ariaLabel: {attribute:'aria-label'}
    }
}}" />
<script>
    import IconButton from "./IconButton.svelte";
    export let value;
    let searchInput;
</script>
<div class="qc-search-input">
    <div class="search-input-border">
        <input
                type="search"
                bind:value
                bind:this={searchInput}
                class="control"
                autocomplete="off"
                {...$$restProps}
        />
        {#if value}
            <IconButton icon="clear-input"
                    color="blue-piv"
                    on:click={e => {e.preventDefault(); value = ""; searchInput.focus()}}
            />
        {/if}
    </div>
</div>
<style lang="scss">
  .qc-search-input {
        height: rem(40);
        max-width: rem(548);
        background-color: token-value(color background);
        border: 1px solid token-value(color formfield border);
        position: relative;
    }
    .search-input-border {
      display: flex;
      flex-grow: 1;
      align-items: stretch;
      border: none;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      z-index: 0;
      &:has(input:focus) {
        border: 2px solid ;
        outline: 2px solid token-value(color formfield focus outline)
      }
    }

    input[type=search] {
        @include content-font();
        background: transparent;
        font-size: rem(16);
        color: token-value(color text primary);
        height: auto;
        width: 100%;
        padding: rem(8) rem(0) rem(8) rem(8);
        border: 1px solid transparent;
        /* clears the ‘X’ from Chrome */
        &::-webkit-search-decoration,
        &::-webkit-search-cancel-button,
        &::-webkit-search-results-button,
        &::-webkit-search-results-decoration {
            display: none;
        }
        &::placeholder {
            color: token-value(color grey medium);
            font-weight: normal;
        }
        &:focus,&:focus-visible {
            outline: none;
        }
    }

    .clear {
        background-color: transparent;
        display: none;
        &.display {
            display: flex;
        }
        cursor: pointer;
        border: 0;
        justify-content: center;
        align-items: center;
        width: rem(40);
    }
</style>