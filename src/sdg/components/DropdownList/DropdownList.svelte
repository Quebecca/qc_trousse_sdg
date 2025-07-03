<script>
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
     * @property {string} [invalid]
     * @property {string} [searchPlaceholder]
     * @property {string} [emptyOptionSrMessage]
     * @property {boolean} [multiple]
     */

    import Fieldset from "../Fieldset/Fieldset.svelte";
    import DropdownListMultiple from "./DropdownListMultiple.svelte";

    /** @type {Props & { [key: string]: any }} */
    let {
        id = Math.floor(Math.random() * 1000),
        legend = '',
        value = $bindable(""),
        items,
        noValueMessage = '',
        noOptionsMessage = ' Aucune option disponible',
        enableSearch = true,
        comboAriaLabel = '',
        ariaRequired = false,
        invalid = $bindable(''),
        searchPlaceholder = '',
        emptyOptionSrMessage = '',
        multiple = false,
        ...rest
    } = $props();

    const name = Math.random().toString(36).substring(2, 15);

    let expanded = $state(false);
</script>

<Fieldset
        {id}
        {legend}
        {invalid}
        {ariaRequired}
        compact="true"
        {...rest}
>
    <div class="qc-dropdown-list-items">
        <button
                class="qc-dropdown-button"
                onclick={() => expanded = !expanded} aria-expanded={expanded}>Choisissez une option</button>
        {#if expanded}
            <DropdownListMultiple {items} {name} {expanded} />
        {/if}
    </div>
</Fieldset>