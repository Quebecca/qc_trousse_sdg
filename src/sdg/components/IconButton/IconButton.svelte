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

