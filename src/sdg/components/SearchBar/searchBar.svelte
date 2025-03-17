<svelte:options customElement="{{
    tag: 'qc-search-bar',
    shadow: 'none',
    props: {
        value: {attribute: 'input-value', type:'String'},
        name: {attribute: 'input-name', type:'String'},
        pivBackground: {attribute: 'piv-background', type:'Boolean'},
    }
}}" />

<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import IconButton from "../Button/IconButton.svelte";

    const
        lang = Utils.getPageLanguage(),
        inputDefaultPlaceholder = lang === "fr"
            ? "Rechercher…"
            : "Search",
        submitDefaultAriaLabel = lang === "fr"
            ? "Lancer la recherche"
            : "Submit search"
    ;
    export let
        value = '',
        name = 'q',
        pivBackground = false
    ;

    let defaultsAttributes = {
            input: {
                "placeholder": inputDefaultPlaceholder,
                "aria-label": inputDefaultPlaceholder
            },
            submit: {
                "aria-label": submitDefaultAriaLabel
            }
        },
        inputProps = {},
        submitProps = {}

    $: [inputProps, submitProps] = computeFieldsAttributes($$restProps)
    $: inputProps = {
        "value": value,
        "name": name,
        ...inputProps
    }

    /**
     * @param {{[p: string]: T}} restProps
     */
    function computeFieldsAttributes(restProps) {
        return ["input","submit"]
            .map(control => {
                    const prefix = `${control}-`;
                    return {
                        ...defaultsAttributes[control],
                        ...Object.fromEntries(Object
                            .entries(restProps)
                            .map(([k,v]) => k.startsWith(prefix)
                                ? [k.replace(prefix, ''),v]
                                : null
                            )
                            .filter(x => x) // élimine les éléments null
                        )
                    }
                }
            )
    }


</script>
<div    class="qc-search-bar"
        class:piv-background={pivBackground}
    >
    <SearchInput {...inputProps}/>
    {#if true}
        <IconButton
                type="submit"
                iconColor={pivBackground ? 'blue-piv' : 'background'}
                icon="loupe-piv-fine"
                iconSize="md"
                {...submitProps}
        />
    {/if}
</div>