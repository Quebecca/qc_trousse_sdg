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
        disabled = false,
        required,
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
        {required}
        {...restProps}
        {checked}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>
