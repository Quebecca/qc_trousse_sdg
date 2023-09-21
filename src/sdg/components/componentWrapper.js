/*! Wrapper needed to support kebab case svelte customElements attributes. 
    Référence : https://github.com/sveltejs/svelte/issues/3852
*/
export const customElements = {
  customFoo: function () {
    return "bar";
  },
  define: (tagName, CustomElement) => {
    class CustomElementWrapper extends CustomElement {
      static get observedAttributes() {
        return (super.observedAttributes || []).map((attr) =>
          attr.replace(/([a-zA-Z])(?=[A-Z])/g, '$1-').toLowerCase(),
        );
      }

      attributeChangedCallback(attrName, oldValue, newValue) {
        super.attributeChangedCallback(
          attrName.replace(/-([a-z])/g, (_, up) => up.toUpperCase()),
          oldValue,
          newValue === '' ? true : newValue, // [Tweaked] Value of omitted value attribute will be true
        );
      }
    }

    window.customElements.define(tagName, CustomElementWrapper); // <--- Call the actual customElements.define with our wrapper
  }
};