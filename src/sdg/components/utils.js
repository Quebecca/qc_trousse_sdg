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
     * extract and clean prefixed attributes
     * example:
     *  computeFieldsAttributes("radio" , {"radio-class":"my-radio", "radio-data-foo":"foo", "other":"other value"})
     *  return {"class":"my-radio", "data-foo":"foo"}
     *
     </div>
     * @param {(string|string[])} prefix - Une chaîne de caractères ou un tableau de chaînes.
     * @param restProps - ojbect of attributes
     * @returns {*} - object of attributes
     */
    static computeFieldsAttributes(prefix , restProps) {
        let output = {},
            _prefix = prefix + '-'
        Object
            .entries(restProps)
            .forEach(([prop,value]) => {
                if (prop.startsWith(_prefix)) {
                    const prefixProp = prop.replace(new RegExp('^' + _prefix), '')
                    output[prefixProp] = value;
                }
            })

        return output;
    }

}