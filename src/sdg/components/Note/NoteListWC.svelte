<svelte:options customElement={{
    tag: 'qc-note-list',
    shadow: 'none',
    props: {
        scope: { attribute: 'scope', type: 'String' },
        display: { attribute: 'display', type: 'String' },
        listTitle: { attribute: 'title', type: 'String' },
    },
    extend: (customElementConstructor) => {
        return class extends customElementConstructor {
            connectedCallback() {
                // Lire le title puis le retirer du DOM : sinon le navigateur
                // affiche une infobulle native au survol de toute la liste.
                const titleValue = this.getAttribute('title');
                if (titleValue) {
                    this.removeAttribute('title');
                    this.listTitle = titleValue;
                }
                super.connectedCallback();
            }
        };
    }
}} />

<script>
    import NoteList from "./NoteList.svelte";

    let {
        listTitle = '',
        ...props
    } = $props();
</script>

<NoteList {...props} title={listTitle} />
