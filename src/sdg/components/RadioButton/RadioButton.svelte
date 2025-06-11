<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        name,
        value,
        label,
        size = "sm",
        other = false,
        checked = false,
        disabled = false,
        ...rest
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

    let restProps = $state({});

    onMount(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["radio"], {}, rest);

        restProps = {...inputProps};
    });
</script>

<div class={`qc-radio-${size}`}>
    <input
        type="radio"
        id={`${name}_${value}`}
        {name}
        {value}
        {...boolAttributes}
        {...restProps}
        bind:this={inputInstance}
    />
    <label for={`${name}_${value}`}>{label}</label>
</div>