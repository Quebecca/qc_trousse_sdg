<svelte:options customElement="{{
  tag:'qc-alert',
  reflect: true,
  props: {
     type : {attribute: 'type'},
     maskable  : {attribute: 'maskable'},
     fullWidth : {attribute: 'full-width'},
     content: {attribute: 'content'},
     hide: {attribute: 'hide'},
  }
}}"/>

<script>
    import {Utils} from "./utils";
    import Icon from "./Icon.svelte";
    import IconButton from "./Button/IconButton.svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = $bindable("false"),
        fullWidth = "false",
    } = $props();

    const language = Utils.getPageLanguage();

    const typeClass = (type !== "") ? type : 'general';
    const closeLabel = language === 'fr' ? "Fermer l’alerte" : "Close l’alerte";
    const warningLabel = language === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    const generalLabel = language === 'fr' ? "Information importante" : "Important information";

    const label = type === 'general' ? generalLabel : warningLabel;

    let rootElement = $state(null);
    let hiddenFlag = $derived(false);

    $effect(() => {
        hiddenFlag = hide === 'true'
    });

    let containerClass = "qc-container" + (fullWidth === 'true' ? '-fluid' : '');

    function hideAlert() {
        hide = "true";
        rootElement.dispatchEvent(
            new CustomEvent('qc.alert.hide', {
                bubbles: true,
                composed: true
            })
        );
    }
</script>

{#if !hiddenFlag}
    <div bind:this={rootElement}
         class="qc-general-alert {typeClass}"
         role="alert">
        <div class={containerClass}>
            <div class="qc-general-alert-elements">
                <Icon type={type === 'warning' ? 'warning' : 'information'}
                      color={type === 'general' ? 'blue-piv' : 'yellow-dark'}
                      size="nm"
                      label={label}
                />
                <div class="qc-alert-content">
                    {@html content}
                    <slot />
                </div>
                {#if maskable === "true"}
                    <IconButton aria-label={closeLabel}
                                onclick={hideAlert}
                                size="nm"
                                icon="clear-input"
                                iconSize="sm"
                                iconColor="text-primary"
                    />
                {/if}
            </div>
        </div>
    </div>
{/if}

<link rel='stylesheet'
      href='{Utils.cssPath}'>