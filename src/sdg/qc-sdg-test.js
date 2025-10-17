import {Utils} from "./components/utils";

document.getElementById('piv-header-mce')
    .setAttribute(
        'logo-src',
        `${Utils.imagesRelativePath}piv-mce-theme-sombre.svg`
    );

export * from './bases/Icon/Test/IconEmbeddedTest.svelte';
export * from './components/TextField/Test/TextFieldEmbededTest.svelte';
export * from "./components/DropdownList/Test/DropdownListSvelteTest.svelte";
export * from "./components/ChoiceGroup/Test/ChoiceGroupeEmbededTest.svelte";
export * from "./components/ToggleSwitch/Test/ToggleSwitchEmbeddedTest.svelte";
export * from "./components/PivHeader/Test/pivHeaderEmbeddedTest.svelte";