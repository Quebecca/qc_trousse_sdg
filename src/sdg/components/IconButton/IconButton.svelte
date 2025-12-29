<script>
import Icon from "../../bases/Icon/Icon.svelte";

const {
    size = 'xl',
    label,
    icon,
    iconSize,
    iconColor,
    class: className = '',
    ...rest
} = $props();

</script>

<button
    data-button-size={size}
    class={`qc-icon-button ${className}`}
    {...rest}
>
    {#if icon}
        <Icon type={icon}
            size={iconSize}
            color={iconColor}
            aria-hidden="true"
            label={label}
        />
    {/if}
</button>

<style lang="scss">
  @use "qc-sdg-lib" as *;

  .qc-icon-button {
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
</style>
