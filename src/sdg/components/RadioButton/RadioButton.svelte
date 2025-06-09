<script>
    import {Utils} from "../utils";

    let {
        name,
        value,
        label,
        size = "sm",
        checked = false,
        disabled = false,
    } = $props();

    let inputInstance = $state();

    let boolAttributes = $derived.by(() => {
        let truthyProps = {
            checked : Utils.isTruthy(checked),
            disabled : Utils.isTruthy(disabled),
        }

        for (const prop in truthyProps) {
            if (!truthyProps[prop]) {
                delete truthyProps[prop];
            }
        }
        return truthyProps;
    })

    function removeInvalid() {
        inputInstance.dispatchEvent(
            new CustomEvent(
                `qc.radio.removeInvalidFor${name}`,
                {bubbles: true, composed: true}
            )
        );
    }
</script>

<div class={`qc-radio-${size}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        {...boolAttributes}
        bind:this={inputInstance}
        onclick={() => removeInvalid()}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>