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

<div class={`qc-radio-tile`}>
    <label for={`${name}_${value}`}>
        <input
                type="radio"
                id={`${name}_${value}`}
                {name}
                {value}
                aria-required={Utils.isTruthy(required)}
                aria-invalid={Utils.isTruthy(invalid)}
                {...boolAttributes}
                {...restProps}
        />
        <span class="qc-radio-tile-label-span">
            <span class="qc-radio-tile-label-choice">{label}</span>
            {#if description}
                <span class="qc-radio-tile-label-description">{description}</span>
            {/if}
        </span>
    </label>
</div>