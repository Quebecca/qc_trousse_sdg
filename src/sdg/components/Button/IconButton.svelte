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
        class="qc-icon-button"
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

