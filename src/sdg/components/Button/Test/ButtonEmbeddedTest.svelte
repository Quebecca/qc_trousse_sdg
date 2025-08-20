<!-- src/components/Button/ButtonEmbeddedTest.svelte -->
<svelte:options customElement={{ tag: 'qc-button-embedded-test' }} />

<script>
    import Button from '../Button.svelte';
    import { Utils } from '../../utils.js';
</script>

<div>
    <Button label="Principal" variant="primary" />
    <Button label="Principal" variant="primary" rounded />
    <Button label="Principal" variant="primary" disabled />
    <Button label="Principal" variant="primary" compact />
    <Button label="Principal" variant="primary" compact rounded />
</div>

<div>
    <Button label="Secondaire" variant="secondary" />
    <Button label="Secondaire" variant="secondary" rounded />
    <Button label="Secondaire" variant="secondary" disabled />
    <Button label="Secondaire" variant="secondary" compact />
    <Button label="Secondaire" variant="secondary" compact rounded />
</div>

<div>
    <Button label="Tertiaire" variant="tertiary" />
    <Button label="Tertiaire" variant="tertiary" rounded />
    <Button label="Tertiaire" variant="tertiary" disabled />
    <Button label="Tertiaire" variant="tertiary" compact />
    <Button label="Tertiaire" variant="tertiary" compact rounded />
</div>

<div>
    <Button label="Avertissement" variant="danger" />
    <Button label="Avertissement" variant="danger" rounded />
    <Button label="Avertissement" variant="danger" disabled />
    <Button label="Avertissement" variant="danger" compact />
    <Button label="Avertissement" variant="danger" compact rounded />
</div>

<div>
    <Button label="Ajouter" variant="primary" icon="plus" iconPosition="left" />
    <Button label="Information" variant="primary" icon="information" iconPosition="right" />
</div>

<div>
    <Button label="Questions" variant="primary" icon="question" iconPosition="left" iconSrc="data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iaXNvLTg4NTktMSI/Pgo8IS0tIEdlbmVyYXRvcjogQWRvYmUgSWxsdXN0cmF0b3IgMTYuMC4wLCBTVkcgRXhwb3J0IFBsdWctSW4gLiBTVkcgVmVyc2lvbjogNi4wMCBCdWlsZCAwKSAgLS0+CjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+CjxzdmcgdmVyc2lvbj0iMS4xIiBpZD0iQ2FwYV8xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB4PSIwcHgiIHk9IjBweCIKCSB3aWR0aD0iOTczLjFweCIgaGVpZ2h0PSI5NzMuMXB4IiB2aWV3Qm94PSIwIDAgOTczLjEgOTczLjEiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDk3My4xIDk3My4xOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKCT4KPGc+Cgk8cGF0aCBkPSJNNTAyLjI5LDc4OC4xOTloLTQ3Yy0zMy4xLDAtNjAsMjYuOS02MCw2MHY2NC45YzAsMzMuMSwyNi45LDYwLDYwLDYwaDQ3YzMzLjEwMSwwLDYwLTI2LjksNjAtNjB2LTY0LjkKCQlDNTYyLjI5LDgxNSw1MzUuMzkxLDc4OC4xOTksNTAyLjI5LDc4OC4xOTl6IiBmaWxsPSIjZmZmIi8+Cgk8cGF0aCBkPSJNMTcwLjg5LDI4NS44bDg2LjcsMTAuOGMyNy41LDMuNCw1My42LTEyLjQsNjMuNS0zOC4zYzEyLjUtMzIuNywyOS45LTU4LjUsNTIuMi03Ny4zYzMxLjYwMS0yNi42LDcwLjktNDAsMTE3LjktNDAKCQljNDguNywwLDg3LjUsMTIuOCwxMTYuMywzOC4zYzI4LjgsMjUuNiw0My4xLDU2LjIsNDMuMSw5Mi4xYzAsMjUuOC04LjEsNDkuNC0yNC4zLDcwLjhjLTEwLjUsMTMuNi00Mi44LDQyLjItOTYuNyw4NS45CgkJYy01NCw0My43LTg5Ljg5OSw4My4wOTktMTA3Ljg5OSwxMTguMDk5Yy0xOC40LDM1LjgwMS0yNC44LDc1LjUtMjYuNCwxMTUuMzAxYy0xLjM5OSwzNC4xLDI1LjgsNjIuNSw2MCw2Mi41aDQ5CgkJYzMxLjIsMCw1Ny0yMy45LDU5LjgtNTQuOWMyLTIyLjI5OSw1LjctMzkuMTk5LDExLjMwMS01MC42OTljOS4zOTktMTkuNzAxLDMzLjY5OS00NS43MDEsNzIuNjk5LTc4LjEKCQlDNzIzLjU5LDQ3Ny44LDc3Mi43OSw0MjguNCw3OTUuODkxLDM5MmMyMy0zNi4zLDM0LjYtNzQuOCwzNC42LTExNS41YzAtNzMuNS0zMS4zLTEzOC05NC0xOTMuNGMtNjIuNi01NS40LTE0Ny04My4xLTI1My04My4xCgkJYy0xMDAuOCwwLTE4Mi4xLDI3LjMtMjQ0LjEsODJjLTUyLjgsNDYuNi04NC45LDEwMS44LTk2LjIsMTY1LjVDMTM5LjY5LDI2Ni4xLDE1Mi4zOSwyODMuNSwxNzAuODksMjg1Ljh6IiBmaWxsPSIjZmZmIi8+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPGc+CjwvZz4KPC9zdmc+Cg=="
    />
</div>

<div>
    <Button label="Action" variant="simple" icon="information" iconPosition="left" />
    <Button label="Action" variant="simple" icon="plus" iconPosition="left" disabled />
    <Button label="Action" variant="simple" icon="external-link" iconPosition="left" compact />
</div>

<link rel='stylesheet' href='{Utils.cssPath}' />