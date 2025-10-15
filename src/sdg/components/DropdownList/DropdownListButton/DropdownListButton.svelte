<script>
    import Icon from "../../../bases/Icon/Icon.svelte";

    let {
        inputId,
        expanded,
        disabled,
        selectedOptionsText = "",
        placeholder,
        ...rest
    } = $props()

    let button;
    export function focus() {
        button?.focus();
    }
</script>

<button
    type="button"
    id={inputId}
    {disabled}
    class="qc-dropdown-button"
    role="combobox"
    bind:this={button}
    {...rest}
>
    {#if selectedOptionsText.length > 0}
        <span class="qc-dropdown-choice">{@html selectedOptionsText}</span>
    {:else}
        <span class="qc-dropdown-placeholder">{@html placeholder}</span>
    {/if}

    <span class={["qc-dropdown-button-icon"]}>
        <Icon
            type="chevron-up-thin"
            color={disabled ? "grey-regular" : "blue-piv"}
            size="sm"
            rotate={expanded ? 0 : 180}
        />
    </span>
</button>