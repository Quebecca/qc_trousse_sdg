import {Utils} from "../utils";

export function onMountInput(input, setTextFieldRow, setValue, setInvalid, setRequired) {
    if (!input) return;
    if (!input.autocomplete) {
        input.autocomplete = "off"
    }
    if (!input.id) {
        input.id =  Utils.generateId(input.type);
    }
    setValue(input.value);
    setRequired(input.required);
    input.addEventListener(
        'input',
        () => {
            setValue(input.value);
            setInvalid(false);
    })
    setTextFieldRow(input.closest('.qc-formfield-row'))
}