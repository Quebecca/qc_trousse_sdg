<svelte:options customElement="{{
  tag:'qc-alert',
  reflect: true,
  props: {
     type : {attribute: 'type'},
     maskable  : {attribute: 'maskable'},
     fullWidth : {attribute: 'full-width'},
     content: {attribute: 'content'},
     hide: {attribute: 'hide', reflect: true},
     persistHidden: {attribute: 'persist-hidden', type: 'Boolean'},
     persistenceKey: {attribute: 'persistence-key', type: 'String'},
  }
}}"></svelte:options>

<script>
    import Alert from "./Alert.svelte";
    import {Utils} from "../utils";

    let {hide = "false", ...props} = $props();

    let rootElement = $state();

    function hideAlertCallback() {
        rootElement?.dispatchEvent(
            new CustomEvent('qc.alert.hide', {
                bubbles: true,
                composed: true
            })
        );
    }
</script>

 <Alert
         bind:hide
         bind:rootElement
         {hideAlertCallback}
         {...props}
         slotContent = {`<slot />`}
 />
<link rel='stylesheet' href='{Utils.cssPath}'>
