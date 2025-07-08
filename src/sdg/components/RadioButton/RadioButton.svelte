<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";
    import Label from "../Label/Label.svelte";

    let {
        name,
        value,
        label,
        compact,
        checked,
        disabled = false,
        required,
        invalid = $bindable(false),
        groupValue = $bindable(),
        ...rest
    } = $props();

</script>

<div class={["qc-check-row", compact && "qc-compact"]}>
    <!-- svelte-ignore a11y_role_supports_aria_props_implicit -->
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        bind:group={groupValue}
        aria-required={required}
        aria-invalid={invalid}
        {checked}
        {disabled}
        {...rest}
    />
    <Label
        forId={`${name}_${value}`}
        text={label}
        compact={compact}
        disabled={disabled}
    />
</div>