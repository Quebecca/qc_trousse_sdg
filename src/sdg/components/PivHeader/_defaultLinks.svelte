<script>
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();

    const {
        joinUsText = lang === 'fr' ? 'Nous joindre' : 'Contact us',
        joinUsUrl = '',
        altLanguageText = lang === 'fr' ? 'English' : 'Français',
        altLanguageUrl = '',
        linksLabel = lang === 'fr' ? 'Navigation PIV' : 'PIV navigation',
    } = $props()
</script>
{#if joinUsUrl || altLanguageUrl}
    <nav aria-label="{linksLabel}">
        <ul>
            {#if altLanguageUrl}
                <li><a href="{altLanguageUrl}">{altLanguageText}</a></li>
            {/if}
            {#if joinUsUrl}
                <li><a href="{joinUsUrl}">{joinUsText}</a></li>
            {/if}
        </ul>
    </nav>
{/if}
