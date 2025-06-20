<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        name,
        value,
        label,
        description,
        compact,
        selectionButton,
        checked,
        disabled = $bindable(false),
        required = $bindable(false),
        invalid = $bindable(false),
        groupValue = $bindable(),
        ...rest
    } = $props();

    let restProps = $state({});
    onMount(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["radio"], {}, rest);

        restProps = {...inputProps};
    });
</script>
    <label
        for={`${name}_${value}`}
        class={[
            !selectionButton && "qc-check-row",
            selectionButton && "qc-selection-button",
        ]}
    >
        <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
        <input
                class={compact || selectionButton ? "qc-compact" : ""}
                type="radio"
                id={`${name}_${value}`}
                {name}
                {value}
                {disabled}
                bind:group={groupValue}
                aria-required={required}
                aria-invalid={invalid}
                {required}
                {...restProps}
                {checked}
        />
        <span class="qc-check-text">
            <span class="qc-check-label">{label}</span>
            {#if description}
                <span class="qc-check-description">{@html description}</span>
            {/if}
        </span>
    </label>