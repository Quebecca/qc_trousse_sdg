import {Utils} from "../../utils";

export function setMcePivHeaderLogoSrc() {
    document.getElementById('piv-header-mce')
        ?.setAttribute(
            'logo-src',
            `${Utils.imagesRelativePath}piv-MCE-theme-sombre.svg`
        );
}