<svelte:options customElement="{{
    tag: 'qc-note-container'
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
    // import {noteStore} from "./NoteStore";
    export let
        self
    ;
    // let indexElement;
    onMount( _ => {
        let index = 1;
        // console.log(self.querySelectorAll('qc-note'))
        self.querySelectorAll('qc-note')
            .forEach(note => note.setAttribute('index', index++));
    })
    // $: $noteStore[id] = index;
</script>
