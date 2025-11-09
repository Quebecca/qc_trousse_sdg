<script>
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    import IconButton from "../IconButton/IconButton.svelte";
    import {onMount} from "svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = "false",
        fullWidth = "false",
        slotContent,
        id,
        persistenceKey,
        persistenceTTL = 86400 * 7,
        persistHidden = false,
    } = $props();

    const language = Utils.getPageLanguage();

    const typeClass = (type !== "") ? type : 'general';
    const closeLabel = language === 'fr' ? "Fermer l’alerte" : "Close l’alerte";
    const warningLabel = language === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    const generalLabel = language === 'fr' ? "Information importante" : "Important information";

    const label = type === 'general' ? generalLabel : warningLabel;

    let rootElement = $state(null);

    let containerClass = "qc-container" + (fullWidth === 'true' ? '-fluid' : '');

    onMount(() => {
        const key = getPersistenceKey();
        if (!key) return false;
        const expire = localStorage.getItem(key) || false;
        if (!expire) return false;
        hide = Utils.now() < expire ? "true" : "false";
    })

    function hideAlert() {
        hide = "true";
        persistHiddenState()
        rootElement.dispatchEvent(
            new CustomEvent('qc.alert.hide', {
                bubbles: true,
                composed: true
            })
        );
    }

    function getPersistenceKey() {
        if (!persistHidden) return false;
        const key = persistenceKey || id;
        if (! key) return false;
        return'qc-alert:' + key;
    }

    function persistHiddenState() {
        const key = getPersistenceKey();
        if (!key) return;
        localStorage.setItem(key,Utils.now() + persistenceTTL * 1000);
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
