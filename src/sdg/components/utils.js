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

    /**
     * Checks if the current node or one of its children is currently in focus
     * @param node The element's node to check
     * @returns {boolean} If the current node or one of its children is currently in focus
     */
    static componentIsActive(node) {
        if (!node) {
            return false;
        }

        const root = node.getRootNode();
        return node.contains(root.activeElement);
    }

    /**
     * Waits for a specified amount of time
     * @param ms The amount of time to wait
     * @returns {Promise<unknown>} The resolution of the sleep action
     */
    static sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    static generateId(prefix = '') {
        return prefix + "-" + (Math.floor(Math.random() * 90000) + 10000);
    }


    /**
     * Returns the word in lowercase and with accented letters replaced by their non-accented counterparts
     * @param str
     * @returns {string}
     */
    static cleanupSearchPrompt(str) {
        let word = String(str)

        const replaceAccents = (str, search, replace) => {
            return str.replaceAll(new RegExp(search, 'gi'), replace);
        }

        // Supprime les accents.
        word = replaceAccents(word, /[éèêë]/gi, 'e');
        word = replaceAccents(word, /[àäâ]/gi, 'a');
        word = replaceAccents(word, /[ùûü]/gi, 'u');
        word = replaceAccents(word, /[ïî]/gi, 'i');
        word = replaceAccents(word, /[ôö]/gi, 'i');
        word = replaceAccents(word, /[œ]/gi, 'oe');
        word = replaceAccents(word, /[æ]/gi, 'ae');

        // Remplace les caractères spéciaux par des espaces.
        word = word.replaceAll(/[-_—–]/gi, ' ');
        word = word.replaceAll(/’/gi, "'");

        // Convertit le mot en minuscules.
        return word.toLowerCase();
    }
}
