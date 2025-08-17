import {Utils} from "../utils";

export function onMountInput(input, setTextFieldRow, setValue, setInvalid) {
    if (!input) return;
    if (!input.autocomplete) {
        input.autocomplete = "off"
    }
    if (!input.id) {
        input.id =  Utils.generateId(input.type);
    }
    setValue(input.value)
    input.addEventListener(
        'input',
        () => {
            setValue(input.value);
            setInvalid(false);
    })
    setTextFieldRow(input.closest('.qc-textfield-row'))
}