<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

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

    let inputInstance = $state();

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

    onMount(() => {
        document.addEventListener(
            `qc.radio.removeInvalidFor${name}`,
            () => {
                hasError = false;
            }
        );
    })

    function removeInvalid() {
        hasError = false;
        inputInstance.dispatchEvent(
            new CustomEvent(
                `qc.radio.removeInvalidFor${name}`,
                {bubbles: true, composed: true}
            )
        );
    }
</script>

<div class={`qc-radio-${size + (Utils.isTruthy(hasError) ? " qc-radio-input-required-" + size : "")}`}>
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