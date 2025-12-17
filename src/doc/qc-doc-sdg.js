export * from './components/Code.svelte';
export * from './components/color-doc.svelte'
export * from './components/TopNav.svelte'
export * from './components/Switch.svelte'
export * from './components/Exemple.svelte'
export * from '../sdg/components/TextField/Doc/TextFieldDemo.svelte'
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
        (evt) => {
            evt.preventDefault();
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

if (maskableAlert && displayAlertLink && !maskableAlert.querySelector('.qc-general-alert')) {
    displayAlertLink.removeAttribute('hidden');
}
// add version


