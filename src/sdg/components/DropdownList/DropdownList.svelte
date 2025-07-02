

<script>
    import { run, handlers, preventDefault, stopPropagation } from 'svelte/legacy';

    /*
    Il reste du travail. Ce code est copié depuis quebec.ca, avec des ajustements pour qu'il compile
    et fonctionne.

    @todo
    - lire https://developer.mozilla.org/fr/docs/Web/Accessibility/ARIA/Reference/Roles/listbox_role
        - réfléchir au nom : qc-select-box ? qc-list-box ? qc-select ? Choix retenu: DropdownList [x]
        - convertir en svelte 5 [x]
        - réparer la css (image, thème sombre, padding des éléments)
        - mettre le bon comportement de focus (couleur et largeur ; utiliser le même que celui du searchInput)
        - faire fonctionner le thème sombre
        - mettre un searchInput au lieu d'un input pour la recherche
        - retirer le rôle combobox, et le remplacer par listbox ; ce rôle est déjà utilisé dans la combobox, donc je le déplacerais dans l'élément racine
          pourquoi : combobox est normalement un input, qui offre un menu de sélection ; ici, c'est un menu de sélection (listbox) avec recherche…
        - et bien sûr : faire fonctionner avec des sous composants qc-option car pour l'instant, l'api est basé sur un attribut Item.
            <qc-select>
              <qc-option>
              (...)

        Idée : le plus simple est peut-être le créer le tableau items à partir des options passées.
        Pour cela, le construire lors du onMount() du composant web (SelectBoxWC) avec un querySelector(),
        et ajouter un MutaterObserver pour gérer l'ajout et retrait d'options.



        Tout ceci est à discuter au moment de démarrer les travaux
     */
    import {Utils} from '../utils'
    import {createEventDispatcher} from 'svelte';

    const dispatch = createEventDispatcher();

    /**
     * @typedef {Object} Props
     * @property {any} [id]
     * @property {string} [label]
     * @property {any} value
     * @property {any} items
     * @property {string} [noValueMessage]
     * @property {string} [noOptionsMessage]
     * @property {boolean} [enableSearch]
     * @property {string} [comboAriaLabel]
     * @property {boolean} [ariaRequired]
     * @property {string} [error]
     * @property {string} [searchPlaceholder]
     * @property {string} [emptyOptionSrMessage]
     * @property {boolean} [multiple]
     */

    /** @type {Props & { [key: string]: any }} */
    let {
        id = Math.floor(Math.random() * 1000),
        label = '',
        value = $bindable(),
        items,
        noValueMessage = '',
        noOptionsMessage = ' Aucune option disponible',
        enableSearch = true,
        comboAriaLabel = '',
        ariaRequired = false,
        error = $bindable(''),
        searchPlaceholder = '',
        emptyOptionSrMessage = '',
        multiple = false,
        ...rest
    } = $props();
    let
        hidden = $state(true),
        ids = {
            control: id + '-control',
            box: id + '-box',
            label: id + '-control-label',
            search: id + '-options-search',
        },
        search = $state(''),
        filteredOptions = $state([]),
        focusIn = $state(false),
        comboButton = $state(),
        searchInput = $state(),
        listBox = $state(),
        ariaActiveDescendant = $derived(valueLabel !== "" ? {"aria-activedescendant": selectedElementId} : {}),
        // si un tableau qui n'est pas dans le format Object.entries() est passé en paramètre, les libellés sont les valeurs,
        labelAsValue = $derived(Array.isArray(items) && items.length > 0 && !Array.isArray(items[0])),
        options = $state(),
        cleanOptions = $derived(Object.fromEntries(
            options.map(option => [
                getOptionValue(option),
                Utils.cleanWord(getOptionLabel(option))
            ])
        )), //
        valueLabel = $state(''),
        root = $state(),
        lastValue
    ;

    // la fonction select() n'est appelée pour la selection multiple qu'en passant par le clavier.
    function select(option) {
        if (multiple) {
            if (!value.includes(getOptionValue(option))) {
                value = [...value, getOptionValue(option)];
            }
            else {
                // Si la valeur existe déjà, on la supprime du tableau (cas d'une désélection).
                value = value.filter(item => item !== getOptionValue(option));
            }
        }
        else {
            value = getOptionValue(option)
        }

        dispatch('select', {'value': value})
        valueLabel = getOptionLabel(option)
        search = ''
        if (!multiple) {
            hideBox()
        }
        if (!root) { // peut arriver en cas de destruction/reconstruction du composant
            return
        }
        if (!multiple) {
            comboButton.focus()
        }
        let e = new CustomEvent('select', {
            composed: true
        });
        e.value = value;
        root.dispatchEvent(e)

    }

    function toggleBox() {
        hidden = !hidden
    }

    function showBox() {
        hidden = false
    }

    function hideBox() {
        hidden = true;
    }

    function handleComboKeyDown(e) {
        switch (e.code) {
            case 'Enter':
            case 'Space':
                toggleBox();
                e.stopPropagation();
                e.preventDefault();
                break;
            case 'ArrowDown':
                showBox()
                setTimeout(() => {
                    if (value) {
                        listBox.querySelector('[aria-selected=true]')?.focus()
                    } else if (enableSearch) {
                        searchInput.focus()
                    } else {
                        listBox.firstChild?.focus()
                    }
                }, 10);
                e.preventDefault()
                break;
            case 'ArrowUp':
                hideBox()
                e.preventDefault()
                break;
            case 'ArrowRight':
                showBox()
                setTimeout(() => {
                    listBox.querySelector('[aria-selected=true]')?.focus()
                }, 10);
                break;
        }
    }

    function handleTextKeyDown(e) {
        // un seul caractère (donc, in Tab, Shift, etc)
        if (!/^.$/i.test(e.key)) {
            return;
        }
        showBox();

        setTimeout(() => {
            if (enableSearch) {
                search = e.key
                searchInput.focus()
            } else {
                search += e.key
                focusOnMatchingOption(e)
            }
        })
        e.stopPropagation()
    }

    function handleSearchArrowKey(e) {
        switch (e.code) {
            case 'ArrowDown':
                listBox.firstChild?.focus()
                e.preventDefault()
                break;
            case 'ArrowUp':
                comboButton.focus()
                hideBox()
                break;
        }
    }

    function handleEscape(e) {
        if (e.code == 'Escape') {
            hideBox();
            comboButton.focus()
        }
    }

    function handleOptionKeyDown(e, option) {
        switch (e.code) {
            case 'Enter':
            case 'Space':
                select(option)
                e.stopPropagation()
                e.preventDefault();
                break;
            case 'ArrowDown':
                e.target.nextElementSibling?.focus()
                e.preventDefault()
                break;
            case 'ArrowLeft':
                comboButton.focus()
                hideBox()
                break;
            case 'ArrowUp':
                if (e.target.previousElementSibling) {
                    e.target.previousElementSibling.focus()
                } else if (enableSearch) {
                    searchInput.focus()
                } else {
                    comboButton.focus();
                    hideBox()
                }
                e.preventDefault()
                e.stopPropagation()
                break;
        }
    }

    function markInnerEvent(e) {
        e.innerEventFromFilter = id
    }

    function checkOutterEvent(e) {
        if ((e.innerEventFromFilter ?? -1) != id) {
            hidden = true;
        }
    }

    function debounce(func, time = 5) {
        let timer
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, time);
        };
    }

    // quand la recherche n'est pas activée,
    // après que l'utilisateur a cherché au clavier
    // on réinitialise search
    let debounceKeyDown = debounce(() => {
        if (enableSearch) {
            return;
        }
        search = ''
    }, 1000);

    function getOptionElementId(option) {
        return 'id-' + options.indexOf(option);
    }

    function getOptionLabel(option) {
        // console.log('getOptionLabel', option);
        return option[1];
    }

    function getOptionValue(option) {
        return labelAsValue ? getOptionLabel(option) : option[0]
    }

    function focusOnMatchingOption(e) {

        let filteredOptions = searchIntoOptions(options, search)
        // console.log(search, filteredOptions)
        if (filteredOptions.length) {
            let optionElementId = getOptionElementId(filteredOptions[0])
            listBox.querySelector('#' + optionElementId).focus()
            // console.log('focusing on option')
        }
    }

    function searchIntoOptions(options, search) {
        return options.filter(option => cleanOptions[getOptionValue(option)].includes(Utils.cleanWord(search)))
    }

    function selectOption(value) {
        // console.log('selecting option value', value, typeof value);
        if (value === null) {
            return;
        }
        options?.forEach(o => {
            if (getOptionValue(o) == value) {
                select(o)
            }
        })
    }

    /**
     * Renvoie un tableau au format Object.entries(), [[i0,v0], [i1,v1],etc]
     * items peut être
     * - un tableau [a,b,c]
     * - un objet {k1: v1, k2: v2}
     * - une Map
     * - un iterator
     */
    function getOptions(items) {
        lastValue = value;
        value = null;
        if (multiple) {
            value = [];
        }
        if (Array.isArray(items)) {
            return items.length && Array.isArray(items[0])
                ? items // array of array, we assume items are in entries format
                : Object.entries(items) // it's an array, so we take the entries
        }
        if (typeof items === 'object') {
            let options = [];
            if (items instanceof Map) {
                // console.log('getOptions', items)
                for (const item of items) {
                    options.push(item)
                }
            } else {
                options = Object.entries(items)
            }
            // console.log("CF - getOptions",options)
            return options;
        }
        return []
    }

    function refreshValue(options) {
        if (Array.isArray(lastValue)) {
            value = options.filter(option =>
                lastValue.includes(getOptionValue(option))
            )
            value = value.length > 0
                ? lastValue
                : [];
        } else {
            value = options.find(option =>
                getOptionValue(option) === lastValue)
                ? lastValue
                : null;
        }
    }

    function topText(options,
                     value,
                     valueLabel,
                     noValueMessage,
                     noOptionsMessage) {
        if (options.length == 0) {
            return noOptionsMessage;
        }
        // ne pas afficher la valeur sélectionnée quand on a une sélection multiple
        if (value && valueLabel !== "" && !multiple) {
            return valueLabel;
        }
        return noValueMessage;
    }


    
    // $: console.log(items[Symbol])
    run(() => {
        options = getOptions(items)
    });
    
    // réinitialisation de la valeur en cas de mise à jour de la liste
    run(() => {
        refreshValue(options)
    });
    // selection de l'option quand maj de la valeur
    run(() => {
        if (!multiple) selectOption(value)
    });
    // $: console.log('combo value update', value, id)
    let selectedElementId = $derived(value ? getOptionElementId(value) : '')
    run(() => {
        filteredOptions =
            enableSearch && search !== ''
                ? searchIntoOptions(options, search)
                : options
    });
    // ,console.log(filteredOptions)
    run(() => {
        error = value ? '' : error
    });
    


</script>
<svelte:document onclick={checkOutterEvent}/>
<input type="hidden"
       value="{value}"
       id="{rest.id}"
       name="{rest.name}"
>
<!-- svelte-ignore a11y_no_static_element_interactions, a11y_click_events_have_key_events -->
<div bind:this={root}
     class:qc-combo-filter={true}
     onclick={markInnerEvent}
     onfocusin={() => focusIn = true}
     onfocusout={() =>
        // si un focusIn n'est pas suivi
        // d'un focusOut après un temps très court
        // on referme la popup
        setTimeout(() => {
          if (!focusIn) {
            hidden=true
          }
          focusIn = false
        }, 5)}
     onkeydown={handlers(handleTextKeyDown, debounceKeyDown, handleEscape)}
     {...rest}
>
    <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
    <label id="{ids.label}"
           for="{ids.control}"
           onclick={e => comboButton.focus()}
    >{label}
        {#if ariaRequired}<span class="required mandatory" aria-hidden="true">*</span>{/if}
    </label>
    <div class="filter-box">
        <div
                bind:this={comboButton}
                tabindex="0"
                role="combobox"
                id="{ids.control}"
                aria-expanded={!hidden}
                aria-controls="{ids.box}"
                aria-haspopup="true"
                aria-labelledby="{ids.label}"
                aria-required={ariaRequired}
                onclick={preventDefault(toggleBox)}
                onkeydown={handleComboKeyDown}
                disabled="{options.length === 0}"
                aria-invalid={error != ''}
                {...ariaActiveDescendant}
        >
            <span>{topText(options, value, valueLabel, noValueMessage, noOptionsMessage)}</span>

        </div>
        <div class="panel-wrapper" {hidden}>
            <div id="{ids.box}"
                 class="panel"
            >
                {#if enableSearch}
                    <input id="{ids.search}"
                           placeholder="{searchPlaceholder}"
                           class:search-on-going={search != ''}
                           type="search"
                           bind:this={searchInput}
                           bind:value={search}
                           tabindex="0"
                           aria-label="Recherche parmi les {comboAriaLabel}"
                           onkeydown={stopPropagation(handleSearchArrowKey)}
                    />
                {/if}

                <ul role="listbox"
                    tabindex="-1"
                    bind:this={listBox}
                >
                    {#each filteredOptions as option}
                        {#if multiple}
                            <li
                                    class="form-check"
                                    id="{getOptionElementId(option)}"
                                    tabindex="0"
                                    onkeydown={e => handleOptionKeyDown(e,option)}
                                    aria-selected="{value && value.includes(getOptionValue(option))}"
                            >
                                <label>
                                    <input
                                            class="form-check-input"
                                            id={getOptionValue(option)}
                                            value={getOptionValue(option)}
                                            type="checkbox"
                                            role="option"
                                            tabindex="-1"
                                            bind:group={value}/>
                                    {getOptionLabel(option)}
                                </label>
                            </li>
                        {:else}
                            <li id="{getOptionElementId(option)}"
                                tabindex="0"
                                onclick={() => select(option)}
                                onkeydown={e => handleOptionKeyDown(e,option)}
                                role="option"
                                aria-selected="{getOptionValue(option) == value ? 'true' : 'false'}"
                            >
                                {#if option[0] === '-1'}
                                    <span class="sr-only">{emptyOptionSrMessage}</span>
                                {/if}
                                {getOptionLabel(option)}
                            </li>
                        {/if}
                    {/each}
                </ul>
            </div>
        </div>
    </div>
    {#if error != ''}
    <span role="alert"
          class="combo-error"><span class="sr-only">erreur</span>{error}</span>
    {/if}

</div>
