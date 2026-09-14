<svelte:options customElement={{
  tag: 'qc-icon-font-svelte-test'
}}/>

<script>
    import Icon from "../Icon.svelte";
    import { Utils } from '../../../components/utils.js';
</script>

<!-- Fixture Svelte pour le mode font — miroir de iconFontBaselineTest.html -->

<!-- Section 1 : Icônes en mode font — toutes tailles -->
<div class="section-material-sizes">
    <h3>Icônes mode font — toutes tailles</h3>
    <div>
        <Icon type="search" size="xs" />
        <Icon type="search" size="sm" />
        <Icon type="search" size="md" />
        <Icon type="search" size="lg" />
        <Icon type="search" size="xl" />
    </div>
    <div>
        <Icon type="close" size="xs" />
        <Icon type="close" size="sm" />
        <Icon type="close" size="md" />
        <Icon type="close" size="lg" />
        <Icon type="close" size="xl" />
    </div>
    <div>
        <Icon type="arrow_upward" size="xs" />
        <Icon type="arrow_upward" size="sm" />
        <Icon type="arrow_upward" size="md" />
        <Icon type="arrow_upward" size="lg" />
        <Icon type="arrow_upward" size="xl" />
    </div>
    <div>
        <Icon type="check" size="xs" />
        <Icon type="check" size="sm" />
        <Icon type="check" size="md" />
        <Icon type="check" size="lg" />
        <Icon type="check" size="xl" />
    </div>
    <div>
        <Icon type="expand_less" size="xs" />
        <Icon type="expand_less" size="sm" />
        <Icon type="expand_less" size="md" />
        <Icon type="expand_less" size="lg" />
        <Icon type="expand_less" size="xl" />
    </div>
    <div>
        <Icon type="info" size="xs" />
        <Icon type="info" size="sm" />
        <Icon type="info" size="md" />
        <Icon type="info" size="lg" />
        <Icon type="info" size="xl" />
    </div>
</div>

<!-- Section 2 : Variantes outlined et filled côte à côte -->
<div class="section-variants">
    <h3>Variantes outlined vs filled</h3>
    <div>
        <Icon type="info" size="lg" variant="outlined" />
        <Icon type="info" size="lg" variant="filled" />
    </div>
    <div>
        <Icon type="check_circle" size="lg" variant="outlined" />
        <Icon type="check_circle" size="lg" variant="filled" />
    </div>
    <div>
        <Icon type="error" size="lg" variant="outlined" />
        <Icon type="error" size="lg" variant="filled" />
    </div>
    <div>
        <Icon type="warning" size="lg" variant="outlined" />
        <Icon type="warning" size="lg" variant="filled" />
    </div>
</div>

<!-- Section 3 : Couleurs personnalisées -->
<div class="section-colors">
    <h3>Couleurs personnalisées</h3>
    <div>
        <Icon type="check_circle" size="lg" color="success" />
        <Icon type="error" size="lg" color="error" />
        <Icon type="warning" size="lg" color="warning" />
        <Icon type="info" size="lg" color="information" />
    </div>
</div>

<!-- Section 4 : Rotation -->
<div class="section-rotation">
    <h3>Rotation</h3>
    <div>
        <Icon type="arrow_upward" size="lg" rotate={0} />
        <Icon type="arrow_upward" size="lg" rotate={90} />
        <Icon type="arrow_upward" size="lg" rotate={180} />
        <Icon type="arrow_upward" size="lg" rotate={270} />
    </div>
</div>

<!-- Section 5 : Icône personnalisée via src (doit fallback en SVG) -->
<div class="section-custom-src">
    <h3>Icône personnalisée (src) — fallback SVG</h3>
    <Icon src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNCAyNCI+PHBhdGggZD0iTTEyIDJDNi40OCAyIDIgNi40OCAyIDEyczQuNDggMTAgMTAgMTAgMTAtNC40OCAxMC0xMFMxNy41MiAyIDEyIDJ6bTAgMThjLTQuNDIgMC04LTMuNTgtOC04czMuNTgtOCA4LTggOCAzLjU4IDggOC0zLjU4IDgtOCA4eiIvPjwvc3ZnPg==" size="lg" />
</div>

<!-- Section 6 : Alias legacy (vérification rétrocompatibilité) -->
<div class="section-legacy">
    <h3>Alias legacy</h3>
    <div>
        <Icon type="arrow-up" size="md" />
        <Icon type="checkmark" size="md" />
        <Icon type="xclose" size="md" />
        <Icon type="clipboard" size="md" />
        <Icon type="external-link" size="md" />
        <Icon type="email" size="md" />
    </div>
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
