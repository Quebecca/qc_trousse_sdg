<script>
    import {Utils} from "./utils";
    import Icon from "./Icon.svelte";
    import IconButton from "./Button/IconButton.svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = "false",
        fullWidth = "false",
        children
    } = $props();

    const typeClass = (type !== "") ? type : 'general';
    const closeLabel = Utils.getPageLanguage() === 'fr' ? "Fermer l’alerte" : "Close l’alerte";
    const warningLabel = Utils.getPageLanguage() === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    const generalLabel = Utils.getPageLanguage() === 'fr' ? "Information importante" : "Important information";

    const label = type === 'general' ? generalLabel : warningLabel;

    let rootElement = $state(null);
    let hiddenFlag = $derived(hide === "true");

    let containerClass = $derived("qc-container" + (fullWidth === 'true' ? '-fluid' : ''));

    $effect(() => {
        hiddenFlag = hide === 'true';
    })

    function hideAlert() {
        hiddenFlag = true;
        rootElement.dispatchEvent(
            new CustomEvent('qc.alert.hide', {
                bubbles: true,
                composed: true
            })
        );
    }

    function showAlert() {
        hiddenFlag = false;
    }
</script>

<p>{hiddenFlag}</p>

{#if !hiddenFlag}
    <div bind:this={rootElement}
         class="qc-general-alert {typeClass}"
         role="alert">
        <div class={containerClass}>
            <div class="qc-general-alert-elements">
                <Icon type={type === 'warning' ? 'warning' : 'information'}
                      color="{type === 'general' ? 'blue-piv' : 'yellow-dark'}"
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