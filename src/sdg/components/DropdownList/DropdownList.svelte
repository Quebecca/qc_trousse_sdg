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
    import Icon from "../Icon/Icon.svelte";
    import DropdownListSingle from "./DropdownListSingle.svelte";

    /** @type {Props & { [key: string]: any }} */
    let {
        id = Math.floor(Math.random() * 1000),
        legend = '',
        value = $bindable(""),
        width = "auto",
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

    let usedWidth = $derived.by(() => {
        if (width ==="sm") {
            return 156;
        } else if (width ==="md") {
            return 342;
        } else if (width ==="lg") {
            return 528;
        } else {
            return 342;
        }
    });
</script>

<Fieldset
        {id}
        {legend}
        {invalid}
        {ariaRequired}
        compact="true"
        {...rest}
>
    <div
            class="qc-dropdown-list"
            style="--dropdown-width: {usedWidth}px;"
            role="listbox"
    >
        <button class="qc-dropdown-button"
                onclick={() => expanded = !expanded} aria-expanded={expanded}>
            Choisissez une option
            <span class={["qc-dropdown-button-icon", expanded && "qc-dropdown-button-icon-expanded"]}>
                <Icon type="chevron-white" size="sm" />
            </span>
        </button>
        <div class={[
                "qc-dropdown-list-items",
                !expanded && "qc-dropdown-list-items-hidden"
            ]} tabindex="-1">
            {#if multiple}
                <DropdownListMultiple {items} {name} />
            {:else}
                <DropdownListSingle {items} />
            {/if}
        </div>
    </div>
</Fieldset>