<script>
    import {Utils} from "../utils";

    let {
        name,
        value,
        label,
        size = "sm",
        checked = false,
        disabled = false,
        required = true,
        hasError = $bindable(false)
    } = $props();

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

    // console.log(Utils.isTruthy(hasError));
</script>

<div class={`qc-radio-${size + (Utils.isTruthy(hasError) ? " qc-radio-input-required-" + size : "")}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        {...boolAttributes}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>