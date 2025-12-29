<script>
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    import IconButton from "../IconButton/IconButton.svelte";
    import {onMount} from "svelte";

    let {
        type = "general",
        maskable = "",
        content = "",
        hide = $bindable("false"),
        fullWidth = "false",
        slotContent,
        id,
        persistenceKey,
        persistHidden = false,
        rootElement = $bindable(),
        hideAlertCallback = () => {},
    } = $props();

    const language = Utils.getPageLanguage();

    const typeClass = (type !== "") ? type : 'general';
    const closeLabel = language === 'fr' ? "Fermer l’alerte" : "Close l’alerte";
    const warningLabel = language === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    const generalLabel = language === 'fr' ? "Information importante" : "Important information";

    const label = type === 'general' ? generalLabel : warningLabel;

    let containerClass = "qc-container" + (fullWidth === 'true' ? '-fluid' : '');

    onMount(() => {
        const key = getPersistenceKey();
        if (!key) return;
        hide = sessionStorage.getItem(key) ? "true" : "false";
    })

    function hideAlert() {
        hide = "true";
        persistHiddenState();
        hideAlertCallback();
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
        sessionStorage.setItem(key, Utils.now());
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

<style lang="scss">
  @use "../../scss/qc-sdg-lib" as *;

  .qc-general-alert {
    padding: token-value(spacer, md) 0;

    @include media-mobile() {
      padding: token-value(spacer, sm) 0;
    }

    .qc-general-alert-elements {
      display: flex;
    }

    &.warning {
      background-color: token-value(color, yellow, pale);
    }

    &.general {
      background-color: token-value(color, blue, pale);
    }

    .qc-alert-content {
      @include content-font(md, semi-bold);
      margin: 0 token-value(spacer, md);
      width: 100%;

      @include media-mobile() {
        @include content-font(sm, semi-bold);
      }
    }

    :global(button) {
      @include qc-formcontrol-box;
      flex-shrink: 0;
      &::before {
        background: transparent;
      }
      cursor: pointer;
    }
  }

  qc-alert {
    display: block;
    [slot], &:not([slot=content]) {
      * {
        margin-bottom: 0;
      }

      a {
        color: token-value(color blue piv);
      }
    }
  }
</style>
