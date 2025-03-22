export * from './components/notice.svelte'
export * from './components/PivHeader/pivHeader.svelte'
export * from './components/pivFooter.svelte'
export * from './components/alert.svelte'
export * from './components/toTop.svelte'
export * from './components/externalLink.svelte'
export * from './components/SearchBar/searchBar.svelte'
export * from './components/SearchInput/SearchInput.svelte'
export * from './components/Icon.svelte'
export * from './components/Note/Note.svelte'
export * from './components/Note/NoteLink.svelte'
export * from './components/Note/NoteContainer.svelte'
import './scss/qc-sdg.scss' ;

const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
if (isDarkMode) {
    document.documentElement.classList.add('qc-dark-theme')
}