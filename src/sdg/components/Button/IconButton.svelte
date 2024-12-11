<script>
import Icon from "../Icon.svelte";

export let
    text = '',
    srText = '',
    size = 'xl',
    icon,
    iconSize,
    iconColor
;

</script>

<button on:click
        {...$$restProps}
        data-button-size={size}
    >
    {#if icon}
    <Icon type="{icon}"
          size={iconSize}
          color={iconColor}
          aria-hidden="true"
    />
    {/if}
    {#if text}
        <span class="button-text">{text}</span>
    {/if}
    {#if srText}
        <span class="sr-only">{srText}</span>
    {/if}
</button>

<style lang="scss">
  button {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    @each $size-type, $size in ( sm: 16, md: 20, nm: 24, lg: 32, xl: 40) {
      &[data-button-size=#{$size-type}] {
        height: rem($size);
        width: rem($size);
      }
    }
  }

  .sr-only {
    @include sr-only();
  }

</style>
