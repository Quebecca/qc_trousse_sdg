<script>
    import Icon from "../../Icon/Icon.svelte";

    let {
        inputId,
        selectedOptionsText,
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
    class="qc-dropdown-button"
    role="combobox"
    bind:this={button}
    {...rest}
>
    <span class="qc-dropdown-text">
        {#if selectedOptionsText.length > 0}
            <span class="qc-dropdown-choice">{@html selectedOptionsText}</span>
        {:else}
            <span class="qc-dropdown-placeholder">{@html placeholder}</span>
        {/if}
    </span>

    <span class={["qc-dropdown-button-icon", expanded && "qc-dropdown-button-icon-expanded"]}>
        <Icon
            type={disabled ? "chevron-grey-thin" : "chevron-blue-thin"}
            size="sm"
        />
    </span>
</button>