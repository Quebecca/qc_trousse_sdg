<script>
import Icon from "../Icon.svelte";

export let
    size = 'xl',
    label,
    icon,
    iconSize,
    iconColor
;

</script>

<button on:click
        data-button-size={size}
        {...$$restProps}
        class="qc-icon-button {$$restProps.class ?? ''}"

    >
    {#if icon}
    <Icon type="{icon}"
          size={iconSize}
          color={iconColor}
          aria-hidden="true"
          label={label}
    />
    {/if}
</button>

