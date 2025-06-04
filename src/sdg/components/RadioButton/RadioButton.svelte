<script>
    import {Utils} from "../utils";

    let {
        name,
        value,
        label,
        size = "sm",
        checked = false,
        disabled = false,
        required = true
    } = $props();

    let boolAttributes = $derived.by(() => {
        let truthyProps = {
            checked : Utils.isTruthy(checked),
            disabled : Utils.isTruthy(disabled),
            required : Utils.isTruthy(required)
        }

        for (const cle in truthyProps) {
            if (!truthyProps[cle]) {
                delete truthyProps[cle];
            }
        }
        return truthyProps;
    })
</script>

<div class={`qc-radio-${size}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        {...boolAttributes}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>