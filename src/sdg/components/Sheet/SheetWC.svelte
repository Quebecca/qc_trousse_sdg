<svelte:options customElement={{
    tag: 'qc-sheet',
    shadow: 'none',
    props: {
        sheetTitle: { attribute: 'title', type: 'String' },
        description: { attribute: 'description', type: 'String' },
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            connectedCallback() {
                // Lire le title puis le supprimer du DOM pour éviter le tooltip natif
                const titleValue = this.getAttribute('title');
                if (titleValue) {
                    this.removeAttribute('title');
                    this.sheetTitle = titleValue;
                }
                super.connectedCallback();
            }
        };
    }
}}/>

<script>
    import Sheet from "./Sheet.svelte";

    let {
        sheetTitle = '',
        description = ''
    } = $props();
</script>

<Sheet {description} host={$host()} title={sheetTitle}/>
