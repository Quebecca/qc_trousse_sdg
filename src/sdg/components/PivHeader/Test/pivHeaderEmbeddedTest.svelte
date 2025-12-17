<svelte:options customElement={{
  tag: 'qc-piv-header-embedded-test',
  shadow: "none",
}}/>

<script>
    import PivHeader from "../PivHeader.svelte";
    import { Utils } from '../../utils.js';
</script>

{#snippet linksSlot()}
    <nav aria-label="Navigation PIV">
        <ul>
            <li><a href="#fakeEnglish">English</a>
            </li>
            <!-- svelte-ignore a11y_invalid_attribute -->
            <li><a href="#">Nous joindre</a>
            </li>
        </ul>
    </nav>
{/snippet}

<PivHeader logoAlt="Accédez à Québec.ca" joinUsUrl="#join-us" altLanguageUrl="#fakeEnglish" {linksSlot}></PivHeader>

<br>

<PivHeader titleText="Titre du site ou du service" titleUrl="https://www.quebec.ca/" logoAlt="Accédez à Québec.ca" {linksSlot}></PivHeader>

<link rel='stylesheet' href='{Utils.cssPath}'>