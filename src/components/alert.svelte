<svelte:options tag="qc-alert"/>
<script>
    import {Utils} from "./utils";

    export let type = "";
    export let maskable = "";
    export let content = "";

    let hideAlert = false;
    let typeClass = (type !== "") ? type : 'general';
    let closeLabel = Utils.getPageLanguage() === 'fr' ? "Fermer" : "Close";
    let warningLabel = Utils.getPageLanguage() === 'fr' ? "Information d'importance élevée" : "Information of high importance";
    let generalLabel = Utils.getPageLanguage() === 'fr' ? "Information importante" : "Important information";
    let label = type === 'general' ? generalLabel : warningLabel;

</script>
{#if !hideAlert}
    <div class="qc-general-alert {typeClass}" role="alert" aria-label={label}>
        <div class="qc-container qc-general-alert-elements">
            <div class="qc-icon qc-{type}-alert-icon" aria-hidden="true"></div>
            <div class="qc-alert-content">
                <slot name="content">
                    {#if content}
                        {@html content}
                    {/if}
                </slot>
                <slot/>
            </div>
            {#if maskable === "true"}
                <div class="qc-alert-close">
                    <button type="button" class="qc-close" aria-label={closeLabel}
                            on:click="{() => hideAlert = true}">
                        <span aria-hidden="true" class="qc-icon qc-xclose-blue qc-close-alert-icon"></span>
                    </button>
                </div>
            {/if}
        </div>
    </div>
{/if}
<link rel='stylesheet' href='css/qc-sdg.css'>