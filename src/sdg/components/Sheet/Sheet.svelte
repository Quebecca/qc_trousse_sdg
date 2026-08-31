<script>
    import {onDestroy} from "svelte";
    import Icon from "../../bases/Icon/Icon.svelte";
    import {Utils} from "../utils";

    const lang = Utils.getPageLanguage();

    let {
        title = '',
        description = '',
        host = null,
        children = null,
    } = $props();

    const closeLabel = lang === 'fr' ?
        "Fermer la feuille" :
        "Close sheet";

    const titleId = Utils.generateId('sheet-title');
    const descriptionId = Utils.generateId('sheet-description');

    let dialog = $state(null);
    let displayModal = $state(false);
    let triggerElement = null;

    // Dernier élément ayant reçu une interaction pointeur, mémorisé globalement.
    // Sur WebKit, cliquer sur un <button> ne lui donne PAS le focus : au moment
    // où show() est appelée, document.activeElement vaut alors <body>. Ce repli
    // permet de retrouver le vrai déclencheur pour lui rendre le focus à la
    // fermeture (règle SGQRI 4).
    let lastPointerTarget = null;
    function trackPointer(e) {
        lastPointerTarget = e.target;
    }
    document.addEventListener('pointerdown', trackPointer, true);

    // Détermine l'élément déclencheur à qui rendre le focus à la fermeture.
    // Priorité à l'élément réellement focusé ; à défaut (WebKit), on remonte
    // depuis la cible du dernier pointerdown jusqu'à un élément focusable.
    function resolveTrigger() {
        const active = document.activeElement;
        if (active && active !== document.body) {
            return active;
        }
        let el = lastPointerTarget;
        while (el && el !== document.body) {
            if (typeof el.focus === 'function' && el.tabIndex > -1) {
                return el;
            }
            el = el.parentElement;
        }
        return active;
    }

    export function show() {
        // Sauvegarder l'élément déclencheur pour y retourner le focus à la fermeture
        triggerElement = resolveTrigger();
        displayModal = true;
    }

    export function close() {
        closeSheet();
    }

    function closeSheet() {
        if (dialog && dialog.open) {
            dialog.close();
        }
    }

    function handleClose() {
        displayModal = false;
        document.body.style.overflow = '';
        // Retourner le focus à l'élément déclencheur (règle SGQRI 4).
        // Le retrait du <dialog> par Svelte (via displayModal) est asynchrone.
        // Tant que le <dialog> modal n'est pas retiré du DOM, WebKit conserve le
        // focus captif dans le dialog et ignore un focus() sur un élément externe
        // (le focus retombe alors sur <body>). On attend donc que le dialog soit
        // réellement retiré avant de restaurer le focus : double requestAnimationFrame
        // (1er frame = Svelte applique le retrait, 2e frame = le focus prend effet),
        // avec repli sur un nouveau frame si le dialog est encore présent.
        const trigger = triggerElement;
        triggerElement = null;
        if (!(trigger && trigger.focus)) return;

        let attempts = 0;
        const restoreFocus = () => {
            // Le <dialog> n'est pas encore retiré du DOM : on réessaie au frame
            // suivant (borné à quelques tentatives pour éviter toute boucle).
            if (dialog && dialog.isConnected && attempts < 10) {
                attempts++;
                requestAnimationFrame(restoreFocus);
                return;
            }
            trigger.focus();
        };
        requestAnimationFrame(restoreFocus);
    }

    function handleBackdropClick(e) {
        if (e.target === dialog) {
            closeSheet();
        }
    }

    function handleCloseClick(e) {
        e.preventDefault();
        closeSheet();
    }

    $effect(() => {
        if (displayModal && dialog && dialog.isConnected && !dialog.open) {
            requestAnimationFrame(() => {
                if (dialog && dialog.isConnected && !dialog.open) {
                    dialog.showModal();
                    document.body.style.overflow = 'hidden';
                    // focus sur le titre ou le dialog à l'ouverture
                    requestAnimationFrame(() => {
                        if (title) {
                            const titleEl = dialog.querySelector('.qc-sheet-title');
                            if (titleEl) titleEl.focus();
                        } else {
                            dialog.focus();
                        }
                    });
                }
            });
        }
    });

    // Expose show/close on the host custom element
    $effect(() => {
        if (host) {
            host.show = () => {
                triggerElement = resolveTrigger();
                displayModal = true;
            };
            host.close = () => {
                closeSheet();
            };
        }
    });

    onDestroy(() => {
        document.body.style.overflow = '';
        document.removeEventListener('pointerdown', trackPointer, true);
    });
</script>

{#if displayModal}
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <dialog bind:this={dialog}
            class="qc-sheet-dialog"
            aria-labelledby={title ? titleId : undefined}
            aria-label={!title ? (lang === 'fr' ? 'Feuille' : 'Sheet') : undefined}
            aria-describedby={!children ? descriptionId : undefined}
            aria-modal="true"
            tabindex="-1"
            onclose={handleClose}
            onclick={handleBackdropClick}>
        <div class="qc-sheet-panel">
            <div class="qc-container">
                <div class="qc-sheet-content qc-scrollbar">
                    {#if title}
                        <h2 class="qc-sheet-title" id={titleId} tabindex="-1">{title}</h2>
                    {/if}
                    {#if children}
                        {@render children()}
                    {:else}
                        <p id={descriptionId}>
                            {@html description}
                        </p>
                    {/if}
                </div>
            </div>
            <div class="qc-sheet-header">
                <button type="button"
                        class="qc-sheet-close"
                        aria-label={closeLabel}
                        onclick={handleCloseClick}>
                    <Icon type="close" color="blue-piv" size="sm"/>
                </button>
            </div>
        </div>
    </dialog>
{/if}
