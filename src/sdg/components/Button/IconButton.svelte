<script>
import Icon from "../Icon.svelte";

export let
    text = '',
    srText = '',
    icon,
    iconSize,
    iconColor
;

</script>

<button on:click
        {...$$restProps}>
    {#if icon}
    <Icon type="{icon}"
          size={iconSize}
          color={iconColor}
    />
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
    display: flex;
    align-items: center;
    justify-content: center;
    // TODO mettre un token
    width: rem(40);
  }
  .sr-only {
    @include sr-only();
  }

</style>
