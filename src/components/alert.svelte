<svelte:options tag="qc-alert"/>
<script>
    import {Utils} from "./utils";
    import { onMount } from "svelte";

    export let
          type = "general"
        , maskable = ""
        , content = ""
        ;

    let
          hideAlert = false
        , typeClass = (type !== "")
                        ? type
                        : 'general'
        , closeLabel = Utils.getPageLanguage() === 'fr'
                        ? "Fermer"
                        : "Close"
        , warningLabel = Utils.getPageLanguage() === 'fr'
                        ? "Information d'importance élevée"
                        : "Information of high importance"
        , generalLabel = Utils.getPageLanguage() === 'fr'
                        ? "Information importante"
                        : "Important information"
        , label = type === 'general'
                        ? generalLabel
                        : warningLabel
        ;

    onMount(() => {


    })

</script>
{#if !hideAlert}
    <div class="qc-general-alert {typeClass}"
         role="alert"
         aria-label={label}>
        <div class="qc-container qc-general-alert-elements">
            <div class="qc-icon qc-{type}-alert-icon"
                 aria-hidden="true"
            ></div>
            <div class="qc-alert-content">
                {@html content}
                <slot />
            </div>
            {#if maskable === "true"}
                <div class="qc-alert-close">
                    <button type="button" class="qc-close" aria-label={closeLabel}
                            on:click="{() => hideAlert = true}">
                        <span aria-hidden="true"
                              class="qc-icon qc-xclose-blue qc-close-alert-icon"
                        ></span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}
<link rel='stylesheet' href='css/qc-sdg.css'>