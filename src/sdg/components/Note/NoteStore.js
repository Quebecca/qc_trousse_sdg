// store.js
import { writable } from 'svelte/store';

export const noteStore = writable({});

export function addLink(noteId, link) {
    noteStore.update(data => {
        let letter = data[noteId].links
    })
}


