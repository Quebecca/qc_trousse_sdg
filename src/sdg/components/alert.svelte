<svelte:options customElement="{{
  tag:'qc-alert',
  props: {
     type  : {attribute: 'type'},
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

    export let
          type = "general"
        , maskable = ""
        , content = ""
        , hide = "false"
        , fullWidth = 'false'
        ;

    let
        rootElement
        , hiddenFlag
        , typeClass = (type !== "")
                        ? type
                        : 'general'
        , closeLabel = Utils.getPageLanguage() === 'fr'
                        ? "Fermer l’alerte"
                        : "Close l’alerte"
        , warningLabel = Utils.getPageLanguage() === 'fr'
                        ? "Information d'importance élevée"
                        : "Information of high importance"
        , generalLabel = Utils.getPageLanguage() === 'fr'
                        ? "Information importante"
                        : "Important information"
        , label = type === 'general'
                        ? generalLabel
                        : warningLabel
        , containerClass
        ;

    $: hiddenFlag = hide === 'true'
    $: containerClass = "qc-container" + (fullWidth === 'true' ? '-fluid' : '');

    function hideAlert() {
        hide='true'
        rootElement.dispatchEvent(
            new CustomEvent('qc.alert.hide',{
                bubbles: true,
                composed: true
            }))
    }

</script>
{#if !hiddenFlag}
    <div bind:this={rootElement}
        class="qc-general-alert {typeClass}"
        role="alert"
        aria-label={label}>
        <div class={containerClass}>
            <div class="qc-general-alert-elements">
                <Icon type={type == 'warning' ? 'warning' : 'information'}
                      color="{type == 'general' ? 'blue-piv' : 'yellow-dark'}"
                      size="nm"
                />
                <div class="qc-alert-content">
                    {@html content}
                    <slot />
                </div>
                {#if maskable === "true"}
                    <IconButton aria-label={closeLabel}
                                on:click={hideAlert}
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