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

    const lang = Utils.getPageLanguage();

    let {
        value = $bindable(''),
        name = 'q',
        pivBackground = false,
        ...rest
    } = $props();


    let defaultsAttributes = {
        input: {
            "placeholder": lang === "fr" ? "Rechercher…" : "Search",
            "aria-label": lang === "fr" ? "Rechercher…" : "Search"
        },
        submit: {
            "aria-label": lang === "fr" ? "Lancer la recherche" : "Submit search"
        }
    };

    let inputProps = $state({});
    let submitProps = $state({});


    $effect(() => {
        const [inputAttrs, submitAttrs] = computeFieldsAttributes(rest);
        inputProps = {
            ...inputAttrs,
            name,
        };
        submitProps = submitAttrs;
    });

    /**
     * @param {{[p: string]: T}} restProps
     */
    function computeFieldsAttributes(restProps) {
        return ["input","submit"].map(control => {
            const prefix = `${control}-`;
            return {
                ...defaultsAttributes[control],
                ...Object.fromEntries(
                    Object.entries(restProps)
                        .map(([k,v]) => k.startsWith(prefix) ? [k.replace(prefix, ''),v] : null)
                        .filter(Boolean) // élimine les éléments null
                )
            };
        });
    }


</script>
<div class="qc-search-bar" class:piv-background={pivBackground}>
    <SearchInput bind:value {...inputProps}/>
        <IconButton
                type="submit"
                iconColor={pivBackground ? 'blue-piv' : 'background'}
                icon="loupe-piv-fine"
                iconSize="md"
                {...submitProps}
        />
</div>