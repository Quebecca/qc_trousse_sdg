<svelte:options customElement="{{
    tag: 'qc-note'
    , shadow: 'none'
    , extend: (customElementConstructor) => {
        // Extend the class so we can let it participate in HTML forms
        return class extends customElementConstructor {
            constructor() {
                super();
                this.self = this;
            }
        };
    }
}}" />
<script>
    import {onMount} from "svelte";
    import {noteStore} from "./NoteStore";
    export let
        self,
        id = '',
        index = 0
    ;
    let indexElement
    ;
    onMount( _ => {
        self.prepend(indexElement)
    })

    function initNoteStore(id) {
        if (id === '') return;
        $noteStore[id] = {
            index: index,
            links: [],
            selected: null,
        }
    }
    $: initNoteStore(id);
    $: $noteStore[id].index = index
</script>
<span bind:this={indexElement}
      id="qc-note-{id}">{index}
    {#each $noteStore[id].links ?? [] as letter}
    <a href="#qc-note-link-{id}-{letter}"
       class:selected={letter == $noteStore[id].selected}
    >{letter}</a>
    {/each}
</span>
<style>
    span,a {
        display: inline-block;
        margin-right: 4px;
    }
    .selected {
        font-weight: bold;
    }
</style>