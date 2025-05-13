<script>
    import {Utils} from "../utils";
    const lang = Utils.getPageLanguage();
    const {
        copyrightUrl = lang === 'fr' ? 'https://www.quebec.ca/droit-auteur' : 'https://www.quebec.ca/en/copyright',
        copyrightText =  '© Gouvernement du Québec, ' + (new Date()).getFullYear()
    } = $props()
</script>
<a href="{copyrightUrl}">
    {copyrightText}
</a>