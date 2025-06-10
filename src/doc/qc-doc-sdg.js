export * from './components/Code.svelte';
export * from './components/color-doc.svelte'
export * from './components/TopNav.svelte'
export * from './components/Switch.svelte'
export * from './components/Exemple.svelte'
import './scss/qc-doc-sdg.scss';

if (document.getElementById("version")) {
    document.getElementById("version").textContent = `_vSDG_`
}

// Show maskable "general alert" component
const displayAlertLink = document.getElementById("show-qc-alert");
const maskableAlert = document.getElementById("alerte-masquable");
if (displayAlertLink) {
    displayAlertLink.addEventListener(
        'click',
        () => {
            maskableAlert.setAttribute('hide', 'false');
            displayAlertLink.hidden = true;
        }
    );
    document.addEventListener(
        'qc.alert.hide',
        () => {
            maskableAlert.setAttribute('hide', 'true');
            displayAlertLink.hidden = false;
        }
    )
}

// Event listener pour l'exemple de validation de formulaire de qc-radio-group
const form = document.getElementById("radio-form");
form.addEventListener("submit", (event) => validateRadioForm(event, form));

function validateRadioForm(event, formToValidate) {
    event.preventDefault();
    const groups = formToValidate.querySelectorAll("qc-radio-group");
    groups.forEach((group) => {
        const checkedValue = Array.from(document.getElementsByName(group.name)).find(r => r.checked);
        if (group.required && !checkedValue) {
            group.invalid = true;
        }
    });
}

const otherRadioGroup = document.querySelector("qc-radio-group[name='ex-md-other']");
const otherField = document.createElement("input");
otherField.setAttribute("type", "text");

document.addEventListener("qc.radio.displayOtherForex-md-other", () => {
   otherRadioGroup.appendChild(otherField);
});
document.addEventListener("qc.radio.hideOtherForex-md-other", () => {
    if (otherRadioGroup.lastChild === otherField) {
        otherRadioGroup.removeChild(otherField);
    }
});
// add version


