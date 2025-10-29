<script>
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    import IconButton from "../IconButton/IconButton.svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = "false",
        fullWidth = "false",
        slotContent,
    } = $props();

    const language = Utils.getPageLanguage();

    const typeClass = (type !== "") ? type : 'general';
    const closeLabel = language === 'fr' ? "Fermer l’alerte" : "Close l’alerte";
    const warningLabel = language === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    const generalLabel = language === 'fr' ? "Information importante" : "Important information";

    const label = type === 'general' ? generalLabel : warningLabel;

    let rootElement = $state(null);

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

{#if !Utils.isTruthy(hide)}
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
                    {@html slotContent}
                </div>
                {#if Utils.isTruthy(maskable)}
                    <IconButton aria-label={closeLabel}
                                onclick={hideAlert}
                                size="nm"
                                icon="xclose"
                                iconSize="sm"
                                iconColor="blue-piv"
                    />
                {/if}
            </div>
        </div>
    </div>
{/if}
