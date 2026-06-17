<svelte:options customElement={{
  tag: 'qc-icon-font-svelte-test'
}}/>

<script>
    import Icon from "../Icon.svelte";
    import { Utils } from '../../../components/utils.js';
</script>

<!-- Fixture Svelte pour le mode font — test via composant Icon directement -->
<div class="test-icons">
    <h2>Tailles</h2>
    <Icon type="search" size="xs" />
    <Icon type="search" size="sm" />
    <Icon type="search" size="md" />
    <Icon type="search" size="nm" />
    <Icon type="search" size="lg" />
    <Icon type="search" size="xl" />

    <h2>Variantes</h2>
    <Icon type="info" size="lg" variant="outlined" />
    <Icon type="info" size="lg" variant="filled" />

    <h2>Couleurs</h2>
    <Icon type="info" size="lg" color="information" />
    <Icon type="check_circle" size="lg" color="success" />
    <Icon type="warning" size="lg" color="warning" />
    <Icon type="error" size="lg" color="error" />

    <h2>Legacy</h2>
    <Icon type="xclose" size="lg" />
    <Icon type="email" size="lg" />
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
