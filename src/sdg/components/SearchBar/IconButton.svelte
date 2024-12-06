<script>
import Icon from "../Icon.svelte";

export let
    text = '',
    srText = '',
    icon,
    size
;

</script>

<button {...$$restProps}>
    {#if icon}
    <Icon type="{icon}" size="md"/>
    {/if}
    {#if text}
        <span class="button-text">{text}</span>
    {/if}
    {#if srText}
        <span class="sr-only">{text}</span>
    {/if}
</button>

<style lang="scss">
  button {
    background: token-value(color background);
    display: flex;
    align-items: center;
    justify-content: center;
    width: rem(40);
    border: 0;
  }
  .sr-only {
    @include sr-only();
  }

</style>
