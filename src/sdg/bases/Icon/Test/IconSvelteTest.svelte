<svelte:options customElement={{
  tag: 'qc-icon-svelte-test'
}}/>

<script>
    import Icon from "../Icon.svelte";
    import { Utils } from '../../../components/utils.js';
</script>

<!-- Section 1 : Icônes Material Symbols (noms canoniques) — toutes tailles -->
<div class="section-material-sizes">
    <h3>Icônes Material Symbols — toutes tailles</h3>
    <div>
        <Icon type="search" size="xs" label="search xs" />
        <Icon type="search" size="sm" label="search sm" />
        <Icon type="search" size="md" label="search md" />
        <Icon type="search" size="lg" label="search lg" />
        <Icon type="search" size="xl" label="search xl" />
    </div>
    <div>
        <Icon type="close" size="xs" label="close xs" />
        <Icon type="close" size="sm" label="close sm" />
        <Icon type="close" size="md" label="close md" />
        <Icon type="close" size="lg" label="close lg" />
        <Icon type="close" size="xl" label="close xl" />
    </div>
    <div>
        <Icon type="arrow_upward" size="xs" label="arrow_upward xs" />
        <Icon type="arrow_upward" size="sm" label="arrow_upward sm" />
        <Icon type="arrow_upward" size="md" label="arrow_upward md" />
        <Icon type="arrow_upward" size="lg" label="arrow_upward lg" />
        <Icon type="arrow_upward" size="xl" label="arrow_upward xl" />
    </div>
    <div>
        <Icon type="check" size="xs" label="check xs" />
        <Icon type="check" size="sm" label="check sm" />
        <Icon type="check" size="md" label="check md" />
        <Icon type="check" size="lg" label="check lg" />
        <Icon type="check" size="xl" label="check xl" />
    </div>
    <div>
        <Icon type="expand_less" size="xs" label="expand_less xs" />
        <Icon type="expand_less" size="sm" label="expand_less sm" />
        <Icon type="expand_less" size="md" label="expand_less md" />
        <Icon type="expand_less" size="lg" label="expand_less lg" />
        <Icon type="expand_less" size="xl" label="expand_less xl" />
    </div>
    <div>
        <Icon type="info" size="xs" label="info xs" />
        <Icon type="info" size="sm" label="info sm" />
        <Icon type="info" size="md" label="info md" />
        <Icon type="info" size="lg" label="info lg" />
        <Icon type="info" size="xl" label="info xl" />
    </div>
    <div>
        <Icon type="warning" size="xs" label="warning xs" />
        <Icon type="warning" size="sm" label="warning sm" />
        <Icon type="warning" size="md" label="warning md" />
        <Icon type="warning" size="lg" label="warning lg" />
        <Icon type="warning" size="xl" label="warning xl" />
    </div>
    <div>
        <Icon type="error" size="xs" label="error xs" />
        <Icon type="error" size="sm" label="error sm" />
        <Icon type="error" size="md" label="error md" />
        <Icon type="error" size="lg" label="error lg" />
        <Icon type="error" size="xl" label="error xl" />
    </div>
    <div>
        <Icon type="check_circle" size="xs" label="check_circle xs" />
        <Icon type="check_circle" size="sm" label="check_circle sm" />
        <Icon type="check_circle" size="md" label="check_circle md" />
        <Icon type="check_circle" size="lg" label="check_circle lg" />
        <Icon type="check_circle" size="xl" label="check_circle xl" />
    </div>
    <div>
        <Icon type="person" size="xs" label="person xs" />
        <Icon type="person" size="sm" label="person sm" />
        <Icon type="person" size="md" label="person md" />
        <Icon type="person" size="lg" label="person lg" />
        <Icon type="person" size="xl" label="person xl" />
    </div>
</div>

<!-- Section 2 : Variantes outlined et filled côte à côte -->
<div class="section-variants">
    <h3>Variantes outlined vs filled</h3>
    <div>
        <Icon type="info" size="lg" variant="outlined" label="info outlined" />
        <Icon type="info" size="lg" variant="filled" label="info filled" />
    </div>
    <div>
        <Icon type="check_circle" size="lg" variant="outlined" label="check_circle outlined" />
        <Icon type="check_circle" size="lg" variant="filled" label="check_circle filled" />
    </div>
    <div>
        <Icon type="error" size="lg" variant="outlined" label="error outlined" />
        <Icon type="error" size="lg" variant="filled" label="error filled" />
    </div>
    <div>
        <Icon type="warning" size="lg" variant="outlined" label="warning outlined" />
        <Icon type="warning" size="lg" variant="filled" label="warning filled" />
    </div>
</div>

<!-- Section 3 : Couleurs personnalisées -->
<div class="section-colors">
    <h3>Couleurs personnalisées</h3>
    <div>
        <Icon type="check_circle" size="lg" color="success" label="success" />
        <Icon type="error" size="lg" color="error" label="error" />
        <Icon type="warning" size="lg" color="warning" label="warning" />
        <Icon type="info" size="lg" color="information" label="information" />
    </div>
</div>

<!-- Section 4 : Rotation -->
<div class="section-rotation">
    <h3>Rotation</h3>
    <div>
        <Icon type="arrow_upward" size="lg" rotate={0} label="0deg" />
        <Icon type="arrow_upward" size="lg" rotate={90} label="90deg" />
        <Icon type="arrow_upward" size="lg" rotate={180} label="180deg" />
        <Icon type="arrow_upward" size="lg" rotate={270} label="270deg" />
    </div>
</div>

<!-- Section 5 : Icône personnalisée via src -->
<div class="section-custom-src">
    <h3>Icône personnalisée (src)</h3>
    <Icon src="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iOTczLjFweCIgaGVpZ2h0PSI5NzMuMXB4IiB2aWV3Qm94PSIwIDAgOTczLjEgOTczLjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk3My4xIDk3My4xOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKCT4KPGc+Cgk8cGF0aCBkPSJNNTAyLjI5LDc5OC4xOTloLTQ3Yy0zMy4xLDAtNjAsMjYuOS02MCw2MHY2NC45YzAsMzMuMSwyNi45LDYwLDYwLDYwaDQ3YzMzLjEwMSwwLDYwLTI2LjksNjAtNjB2LTY0LjkKCQlDNTYyLjI5LDgxNSw1MzUuMzkxLDc4OC4xOTksNTAyLjI5LDc4OC4xOTl6IiBmaWxsPSIjZmZmIi8+Cgk8cGF0aCBkPSJNMTcwLjg5LDI4NS44bDg2LjcsMTAuOGMyNy41LDMuNCw1My42LTEyLjQsNjMuNS0zOC4zYzEyLjUtMzIuNywyOS45LTU4LjUsNTIuMi03Ny4zYzMxLjYwMS0yNi42LDcwLjktNDAsMTE3LjktNDAKCQljNDguNywwLDg3LjUsMTIuOCwxMTYuMywzOC4zYzI4LjgsMjUuNiw0My4xLDU2LjIsNDMuMSw5Mi4xYzAsMjUuOC04LjEsNDkuNC0yNC4zLDcwLjhjLTEwLjUsMTMuNi00Mi44LDQyLjItOTYuNyw4NS45CgkJYy01NCw0My43LTg5Ljg5OSw4My4wOTktMTA3Ljg5OSwxMTguMDk5Yy0xOC40LDM1LjgwMS0yNC44LDc1LjUtMjYuNCwxMTUuMzAxYy0xLjM5OSwzNC4xLDI1LjgsNjIuNSw2MCw2Mi41aDQ5CgkJYzMxLjIsMCw1Ny0yMy45LDU5LjgtNTQuOWMyLTIyLjI5OSw1LjctMzkuMTk5LDExLjMwMS01MC42OTljOS4zOTktMTkuNzAxLDMzLjY5OS00NS43MDEsNzIuNjk5LTc4LjEKCQlDNzIzLjU5LDQ3Ny44LDc3Mi43OSw0MjguNCw3OTUuODkxLDM5MmMyMy0zNi4zLDM0LjYtNzQuOCwzNC42LTExNS41YzAtNzMuNS0zMS4zLTEzOC05NC0xOTMuNGMtNjIuNi01NS40LTE0Ny04My4xLTI1My04My4xCgkJYy0xMDAuOCwwLTE4Mi4xLDI3LjMtMjQ0LjEsODJjLTUyLjgsNDYuNi04NC45LDEwMS44LTk2LjIsMTY1LjVDMTM5LjY5LDI2Ni4xLDE1Mi4zOSwyODMuNSwxNzAuODksMjg1Ljh6IiBmaWxsPSIjZmZmIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg==" size="lg" label="icône personnalisée" />
</div>

<!-- Section 6 : Alias legacy (vérification rétrocompatibilité) -->
<div class="section-legacy">
    <h3>Alias legacy</h3>
    <div>
        <Icon type="arrow-up" size="md" label="arrow-up" />
        <Icon type="checkmark" size="md" label="checkmark" />
        <Icon type="xclose" size="md" label="xclose" />
        <Icon type="clipboard" size="md" label="clipboard" />
        <Icon type="external-link" size="md" label="external-link" />
        <Icon type="ligth-bulb" size="md" label="ligth-bulb" />
    </div>
</div>

<link rel='stylesheet' href='{Utils.cssPath}'>
