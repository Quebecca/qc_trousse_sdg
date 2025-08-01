<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        name,
        label,
        value = label,
        description,
        compact,
        tiled,
        checked,
        disabled = $bindable(false),
        required = $bindable(false),
        invalid = $bindable(false),
        groupValue = $bindable(),
        ...rest
    } = $props();
    let inputId = $derived(rest.id ?? `${name}-${value}-${Math.random().toString(36).substring(2, 15)}`);
</script>

<label
        for={inputId}
        class={[
        !tiled && "qc-check-row",
        tiled && "qc-selection-button",
    ]}
>
    <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
    <input
            class={compact || tiled ? "qc-compact" : ""}
            type="radio"
            id={inputId}
            {name}
            {value}
            bind:group={groupValue}
            aria-required={required}
            aria-invalid={invalid}
            {checked}
        {disabled}
        {...rest}
    />
    <span class="qc-check-text">
        <span class="qc-check-label">{label}</span>
        {#if description}
            <span class="qc-check-description">{@html description}</span>
        {/if}
    </span>
</label>