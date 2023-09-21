export * from './components/code.svelte';
import './scss/qc-doc-sdg.scss';

// Show maskable "general alert" component
const displayAlertLink = document.getElementById("show-qc-alert");
const maskableAlert = document.getElementById("alert-warning");
displayAlertLink.addEventListener(
    'click',
    () => {
        maskableAlert.setAttribute('hide', 'false');
        displayAlertLink.hidden = true;
    }
);
document.addEventListener(
    'qc.alert.hide',
    () => displayAlertLink.hidden = false
)

// add version
document.getElementById("version").textContent = `_vSDG_`

