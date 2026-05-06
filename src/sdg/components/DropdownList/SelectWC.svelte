<svelte:options customElement="{{
    tag: 'qc-select',
    props: {
        id: {attribute: 'id', type: 'String'},
        label: {attribute: 'label', type: 'String', reflect: true},
        width: {attribute: 'width', type: 'String'},
        value: {attribute: 'value', type: 'String', reflect: true},
        enableSearch: {attribute: 'enable-search', type: 'Boolean'},
        required: {attribute: 'required', type: 'Boolean'},
        disabled: {attribute: 'disabled', type: 'Boolean'},
        invalid: {attribute: 'invalid', type: 'Boolean', reflect: true},
        invalidText: {attribute: 'invalid-text', type: 'String'},
        placeholder: {attribute: 'placeholder', type: 'String'},
        searchPlaceholder: {attribute: 'search-placeholder', type: 'String'},
        noOptionsMessage: {attribute: 'no-options-message', type: 'String'},
        multiple: {attribute: 'multiple', type: 'Boolean'},
        expanded: {attribute: 'expanded', type: 'Boolean', reflect: true},
    }
}}"/>

<script>
    /**
     * ============================================================================
     * INVARIANTS CRITIQUES — Fix v1.5.2 (issue #36)
     * ============================================================================
     *
     * Ce composant contient trois mécanismes interdépendants introduits dans la
     * v1.5.2 pour corriger la perte de sélection lors de reconstructions dynamiques
     * des options DOM (Angular @for, React map, etc.). Ces mécanismes DOIVENT être
     * préservés lors de tout refactoring.
     *
     * 1. DEBOUNCE MUTATIONOBSERVER AVEC CAPTURE DE `lastKnownValue`
     *    ─────────────────────────────────────────────────────────────
     *    Le MutationObserver est appelé synchronement par le navigateur à chaque
     *    mutation DOM. Lors d'une reconstruction (innerHTML vidé puis recréé),
     *    plusieurs mutations sont émises en rafale. Le debounce (setTimeout 0ms)
     *    regroupe ces mutations en un seul appel à setupItemsList.
     *
     *    INVARIANT : La valeur courante (`value`) est capturée dans `lastKnownValue`
     *    au PREMIER appel synchrone (quand `setupDebounceTimer === null`), AVANT le
     *    setTimeout. Cela garantit que la valeur sauvegardée reflète l'état AVANT
     *    que le navigateur ne réinitialise les options (sélection de la 1re option
     *    par défaut).
     *
     * 2. PARAMÈTRE `preservedValue` DANS `setupItemsList`
     *    ──────────────────────────────────────────────────
     *    Lors d'une reconstruction dynamique, le navigateur marque la première
     *    option comme `selected` par défaut. Le paramètre `preservedValue` permet
     *    d'ignorer `option.selected` et d'utiliser la valeur capturée à la place.
     *
     *    INVARIANT : Si `preservedValue` est fourni et non vide, l'état `checked`
     *    des items est déterminé par `preservedValue.includes(option.value)` et NON
     *    par `option.selected`. Cela empêche le reset parasite de la sélection.
     *
     * 3. FLAG `internalChange` AUTOUR DE `dispatchEvent('change')`
     *    ──────────────────────────────────────────────────────────
     *    Quand `value` change (sélection utilisateur ou assignation programmatique),
     *    le composant synchronise le DOM natif (option.selected) et dispatche un
     *    événement `change`. Sans protection, cet événement déclencherait
     *    `handleSelectChange` → `setupItemsList` → reset de la sélection.
     *
     *    INVARIANT : `internalChange = true` est positionné AVANT toute modification
     *    du DOM natif ou dispatch d'événement, et remis à `false` APRÈS `tick()`
     *    (fin du cycle Svelte). Le guard `if (internalChange) return` dans
     *    `handleSelectChange` coupe la boucle réactive.
     *
     *    Le timer de debounce est nettoyé dans `onDestroy` pour éviter les fuites
     *    mémoire.
     * ============================================================================
     */

    import {onDestroy, onMount, tick} from "svelte";
    import DropdownList from "./DropdownList.svelte";
    import {Utils} from "../utils";

    let {
        invalid = $bindable(false),
        value = $bindable([]),
        multiple,
        disabled,
        required,
        label,
        placeholder,
        width,
        expanded = $bindable(false),
        ...rest
    } = $props();

    let selectElement = $state();
    let items = $state();
    let labelElement = $state();
    let setupDebounceTimer = null;
    let lastKnownValue = [];
    const debouncedSetupItemsList = () => {
        // Capturer la valeur AVANT le debounce — le MutationObserver
        // est appelé synchronement par le navigateur, avant les $effect Svelte
        if (setupDebounceTimer === null) {
            lastKnownValue = [...value];
        }
        clearTimeout(setupDebounceTimer);
        setupDebounceTimer = setTimeout(() => {
            setupDebounceTimer = null;
            const options = selectElement?.querySelectorAll("option");
            if (options && options.length > 0) {
                setupItemsList(lastKnownValue);
            }
        }, 0);
    };
    const observer = Utils.createMutationObserver($host(), debouncedSetupItemsList);
    const observerOptions = {
        childList: true,
        attributes: true,
        subtree: true,
        attributeFilter: ["label", "value", "disabled", "selected"]
    };
    let instance = $state();
    let errorElement = $state();
    let parentRow = $derived($host().closest(".qc-formfield-row"));
    let internalChange = false;
    let previousValue = $state(value);

    onMount(() => {
        selectElement = $host().querySelector("select");
        labelElement = $host().querySelector("label");
        if (labelElement) {
            label = labelElement.innerHTML;
        }

        if (selectElement) {
            multiple = selectElement.multiple;
            disabled = selectElement.disabled;

            selectElement.addEventListener("change", handleSelectChange);

            observer?.observe(selectElement, observerOptions);
        }
        setupItemsList();
        $host().classList.add("qc-select");
    });

    onDestroy(() => {
        clearTimeout(setupDebounceTimer);
        observer?.disconnect();
        selectElement.removeEventListener("change", handleSelectChange);
    });

    $effect(() => {
        if (!selectElement) return;
        if (!selectElement.options) return;
        internalChange = true;
        for (const option of selectElement.options) {
            const selected = value.includes(option.value);
            if (selected !== option.selected) {
                option.toggleAttribute("selected", selected);
                option.selected = selected;
            }
        }
        tick().then(() => internalChange = false);
    });

    $effect(() => {
        if (previousValue.toString() !== value.toString()) {
            internalChange = true;
            previousValue = value;
            selectElement?.dispatchEvent(new CustomEvent('change', {detail: value}));
            tick().then(() => internalChange = false);
        }
    });

    $effect(() => {
        if (expanded) {
            selectElement?.dispatchEvent(
                new CustomEvent('qc.select.show', {
                    bubbles: true,
                    composed: true
                })
            );
        } else {
            selectElement?.dispatchEvent(
                new CustomEvent('qc.select.hide', {
                    bubbles: true,
                    composed: true
                })
            );
        }
    });

    $effect(() => {
       if (parentRow && errorElement) {
           parentRow.appendChild(errorElement);
       }
    });

    function setupItemsList(preservedValue) {
        const options = selectElement?.querySelectorAll("option");
        if (options && options.length > 0) {
            // Étape 1 : Construire les items (métadonnées uniquement)
            const newItems = Array.from(options).map(option => ({
                value: option.value,
                label: option.label ?? option.innerHTML,
                disabled: option.disabled,
            }));

            // Étape 2 : Déterminer value séparément
            if (preservedValue && preservedValue.length > 0) {
                // Reconstruction dynamique : filtrer les valeurs préservées
                // contre les nouveaux items (ne garder que celles qui existent encore)
                value = preservedValue.filter(v =>
                    newItems.some(item => item.value === v)
                );
            } else {
                // Initialisation : extraire depuis option.selected du DOM
                // Filtrer les valeurs vides (options placeholder avec value="")
                value = Array.from(options)
                    .filter(opt => opt.selected && opt.value !== "")
                    .map(opt => opt.value);
            }

            // Étape 3 : Ajouter checked dérivé de value pour compatibilité
            // avec DropdownList (qui lit encore item.checked jusqu'au Task 4)
            // Note : pas d'id ici — DropdownList le génère via son $effect
            items = newItems.map(item => ({
                ...item,
                checked: value.includes(item.value),
            }));
        } else {
            items = [];
        }
    }

    function handleSelectChange() {
        if (internalChange) return;
        setupItemsList();
    }
</script>

<div hidden>
    <slot />
</div>

<DropdownList
        {label}
        ariaLabel={selectElement?.getAttribute("aria-label")}
        {items}
        {placeholder}
        {width}
        webComponentMode={true}
        bind:value
        bind:errorElement
        bind:invalid
        bind:rootElement={instance}
        {multiple}
        {disabled}
        {required}
        bind:expanded
        {...rest}
/>
<link rel='stylesheet' href='{Utils.cssPath}'>
