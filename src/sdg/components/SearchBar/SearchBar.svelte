<script>
    import {Utils} from "../utils";
    import SearchInput from "../SearchInput/SearchInput.svelte";
    import IconButton from "../IconButton/IconButton.svelte";

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
        const [inputAttrs, submitAttrs] = Utils.computeFieldsAttributes(["input","submit"], defaultsAttributes, rest);
        inputProps = {
            ...inputAttrs,
            name,
        };
        submitProps = submitAttrs;
    });
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