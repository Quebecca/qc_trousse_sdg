<script>
    import {Utils} from "../utils";
    /* todo : renommer les propriété : radioName -> name tout court. */
    let {
        radioName,
        radioValue,
        radioLabel,
        radioSize = "sm",
        radioChecked = false,
        radioDisabled,
        radioRequired = true
    } = $props();
    //  le but est de ne pas afficher les propriétés dont les valeurs sont fausses,
    // par exemple : required = false
    let attributes = $derived.by(_ => {
        let truthyProps = {
            checked : Utils.isTruthy(radioChecked),
            disabled : Utils.isTruthy(radioDisabled),
            required : Utils.isTruthy(radioRequired)
        }

        for (const cle in truthyProps) {
            if (!truthyProps[cle]) {
                delete truthyProps[cle];
            }
        }
        return truthyProps;
    })
</script>

<div class={`qc-radio-${radioSize}`}>
    <input
        type="radio"
        id={`${radioName}_${radioValue}`}
        name={radioName}
        value={radioValue}
        {...attributes}
    />
    <label for={`${radioName}_${radioValue}`}>{radioLabel}</label>
</div>