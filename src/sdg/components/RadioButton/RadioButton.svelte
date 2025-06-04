<script>
    import {Utils} from "../utils";
    import {setContext} from "svelte";

    let {
        name,
        value,
        label,
        size = "sm",
        checked = false,
        disabled = false,
        required = true,
        hasError = false
    } = $props();

    let inputs = $state();
    setContext("hasError", () => inputs)

    let boolAttributes = $derived.by(() => {
        let truthyProps = {
            checked : Utils.isTruthy(checked),
            disabled : Utils.isTruthy(disabled),
            required : Utils.isTruthy(required)
        }

        for (const prop in truthyProps) {
            if (!truthyProps[prop]) {
                delete truthyProps[prop];
            }
        }
        return truthyProps;
    })
</script>

<div class={`qc-radio-${size + (Utils.isTruthy(hasError) ? " qc-radio-input-required-" + size : "")}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        {...boolAttributes}
        bind:group={inputs}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>