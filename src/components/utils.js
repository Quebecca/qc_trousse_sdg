
export class Utils {
    static relativeBasePath = document.currentScript.getAttribute('relative-base-path') || '/';
    static cssRelativePath = `${this.relativeBasePath}/css/`.replace('//','/')
    static imagesRelativePath = `${this.relativeBasePath}/images/`.replace('//','/')
    static cssFileName = document.currentScript.getAttribute('sdg-css-filename') || 'qc-sdg.min.css'


    //TODO tout traduire en anglais au fur et à mesure que ce sera utilisé dans les composants ajoutés au SDG
    static conserverFocusElement(componentShadow, componentRoot) {
        const elementsFocusablesShadow = Array.from(this.obtenirElementsFocusables(componentShadow))
        const elementsFocusablesRoot = Array.from(this.obtenirElementsFocusables(componentRoot))
        const elementsFocusables = elementsFocusablesShadow.concat(elementsFocusablesRoot)

        const premierElementFocusable = elementsFocusables[0];
        const dernierElementFocusable = elementsFocusables[elementsFocusables.length - 1];
        const KEYCODE_TAB = 9;

        componentShadow.addEventListener('keydown', function(e) {
            let estToucheTab = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

            if (!estToucheTab) {
                return
            }
    
            const elementActif = document.activeElement.shadowRoot ? document.activeElement.shadowRoot.activeElement : document.activeElement
            if (e.shiftKey) /* shift + tab */ {
                if (elementActif === premierElementFocusable) {
                    dernierElementFocusable.focus()
                    e.preventDefault()
                }
            } else /* tab */ {
                if (elementsFocusables.length === 1 || elementActif === dernierElementFocusable ) {
                    premierElementFocusable.focus()
                    e.preventDefault()
                }
            }    
        })
    }
    static obtenirElementsFocusables(element) {
            return element.querySelectorAll('a[href]:not([disabled]), button:not([disabled]), textarea:not([disabled]), input:not([type="hidden"]):not([disabled]), select:not([disabled])')
        }
    /**
     * Generate a unique id.
     * @returns Unique id.
     */
    static generateId() {
        return Date.now().toString(36) + '-' + Math.random().toString(36).substr(2, 9);
    }
    /**
     * Create a custom event for a webComponent.
     * @param {*} component Object associated to the component (DOM object).
     * @param {*} eventName Event name. 
     * @param {*} eventDetails Event details.
     */
    static dispatchWcEvent = (component, eventName, eventDetails) => {
        component.dispatchEvent(new CustomEvent(eventName, {
            detail: eventDetails,
            composed: true // propagate event through shadow DOM (goes up to document)
        }))
    }

    static isMobile() {
        return navigator.maxTouchPoints || 'ontouchstart' in document.documentElement
    }

    static adjustInterfaceBeforeModalDialogVisible(html, body) {
        
        if(!this.isMobile()){
            const htmlScrollbarWidth = window.innerWidth - html.offsetWidth

            if(htmlScrollbarWidth > 0){
                html.style['padding-right'] = htmlScrollbarWidth + 'px'
            } 
            else {
                const bodyScrollbarWidth = window.innerWidth - body.offsetWidth
                if(bodyScrollbarWidth > 0){
                    body.style['padding-right'] = bodyScrollbarWidth + 'px'
                }
            }
        }      
        // Ensure scroll won't change after the body is modified with a fixed position
        const scrollY = window.scrollY;
        html.classList.add("sdg-dialog-visible")
        document.body.style.top = `-${scrollY}px`;
    }

    static adjustInterfaceWhileModalDialogVisible(body, modalDialog) {

        if(!this.isMobile()){
            const dialogScrollbarWidth = window.innerWidth - modalDialog.offsetWidth
            if(dialogScrollbarWidth > 0){
                body.style['padding-right'] = dialogScrollbarWidth + 'px'
            }     
        }         
    }

    static adjustInterfaceModalDialogHidden(html, body) {        
        html.style.removeProperty('padding-right')
        body.style.removeProperty('padding-right')
        html.classList.remove("sdg-dialog-visible")

        /* Repositionner l'écran où il était avant l'affichage de la modale. */    
        const scrollY = document.body.style.top;
        document.body.style.position = '';
        document.body.style.top = '';
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
    }

    static isSlot(slots, nomSlot) {
        return slots.some(s => s.slot === nomSlot)
    }

    static getSlot(slots, nomSlot) {
        return slots.find(s => s.slot === nomSlot)
    }

    static getDefaultsValues() {
        
        return {
            text:{
                srOpenInNewWindow: this.getPageLanguage() === 'fr' ? `. Ce lien sera ouvert dans un nouvel onglet.` : `. This link will open in a new tab.`
            }
        }
    }
    /**
     * Get current page language.
     * @returns {string} Language code of the current page (fr/en).
     */
    static getPageLanguage() {
        return document.getElementsByTagName("html")[0].getAttribute("lang") || "fr";
    }
}