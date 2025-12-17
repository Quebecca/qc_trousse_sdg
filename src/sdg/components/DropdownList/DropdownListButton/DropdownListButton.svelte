<script>
    import Icon from "../../../bases/Icon/Icon.svelte";

    let {
        inputId,
        expanded,
        disabled,
        selectedOptionsText = "",
        placeholder,
        buttonElement = $bindable(),
        ...rest
    } = $props()
</script>

<button
    type="button"
    id={inputId}
    {disabled}
    class="qc-dropdown-button"
    role="combobox"
    bind:this={buttonElement}
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