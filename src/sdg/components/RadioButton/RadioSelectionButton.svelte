<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        name,
        value,
        label,
        checked = false,
        disabled = false,
        required = false,
        invalid = false,
        description,
        ...rest
    } = $props();

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

<label for={`${name}_${value}`} class="qc-radio-select">
    <input
            class="qc-radio-select-input"
            type="radio"
            id={`${name}_${value}`}
            {name}
            {value}
            aria-required={Utils.isTruthy(required)}
            aria-invalid={Utils.isTruthy(invalid)}
            {...boolAttributes}
            {...restProps}
    />
    <span class="qc-radio-select-label-span">
        <span class="qc-radio-select-label-choice">{label}</span>
        {#if description}
            <span class="qc-radio-select-label-description">{@html description}</span>
        {/if}
    </span>
</label>