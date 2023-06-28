export * from '../src/components/componentWrapper';
export * from './components/code.svelte';
import './scss/qc-catalog-sdg.scss';

// Show maskable "general alert" component
const content = document.getElementById("maskable-alert").innerHTML;
document
    .getElementById("show-qc-alert")
    .addEventListener('click', function (e)  {
        document.getElementById("maskable-alert").innerHTML = content;
});

// add version
document.getElementById("version").textContent = `_vSDG_`

