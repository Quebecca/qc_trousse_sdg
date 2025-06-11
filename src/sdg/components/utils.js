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
     * Nettoie un mot en supprimant les accents, le convertissant en minuscules et en
     * remplaçant les caractères spéciaux par des espaces.
     *
     * @param {any} value Le mot à nettoyer.
     * @returns {string} La chaîne de caractères représentant le mot nettoyé.
     */
    static cleanWord(value) {
        let word = String(value)
        /**
         * Remplace les lettres accentuées par leur version non accentuée.
         * @param {string} str La chaîne de caractères à traiter.
         * @param {string} search Les caractères accentués à rechercher.
         * @param {string} replace Le caractère de remplacement.
         * @returns {string} La chaîne de caractères avec les accents remplacés.
         */
        function replaceAccents(str, search, replace) {
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