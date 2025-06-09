export class Utils {

    static assetsBasePath =
        document
            .currentScript
            .getAttribute('sdg-assets-base-path')
        || new URL(document.currentScript.src).pathname
                    .split('/')
                    .slice(0, -2)
                    .join('/')
        || '/'
    static cssRelativePath =
        `${this.assetsBasePath}/css/`
            .replace('//','/')
    static imagesRelativePath =
        `${this.assetsBasePath}/img/`
            .replace('//','/')
    static cssFileName =
        document
            .currentScript
            .getAttribute('sdg-css-filename')
        || 'qc-sdg.min.css'
    static cssPath =
        document
            .currentScript
            .getAttribute('sdg-css-path')
        || this.cssRelativePath + this.cssFileName
    static sharedTexts =
        { openInNewTab :
            { fr: 'Ce lien s’ouvrira dans un nouvel onglet.'
            , en: 'This link will open in a new tab.'
            }
        }

    /**
     * Get current page language based on html lang attribute
     * @returns {string} language code  (fr/en).
     */
    static getPageLanguage() {
        return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
    }

    static isTruthy(value) {
        if (typeof value === 'boolean') {
            return value;
        }
        if (typeof value === 'string') {
            return value.toLowerCase() === 'true' || !!parseInt(value); // Vérifie si la chaîne est "true" (insensible à la casse)
        }
        if (typeof value === 'number') {
            return !!value; // Vérifie si le nombre est égal à 1
        }
        return false;
    }

    /**
     * Produces an array of props objects, with each object containing all props that start with the associated prefix
     * passed in tags
     * @param tags
     * @param defaultsAttributes
     * @param restProps
     * @returns {*} The array of props objects
     */
    static computeFieldsAttributes(tags, defaultsAttributes, restProps) {
        return tags.map(control => {
            const prefix = `${control}-`;
            return {
                ...defaultsAttributes[control],
                ...Object.fromEntries(
                    Object.entries(restProps)
                        .map(([k,v]) => k.startsWith(prefix) ? [k.replace(prefix, ''),v] : null)
                        .filter(Boolean) // élimine les éléments null
                )
            };
        });
    }

}