<script>
    import IconButton from '../IconButton/IconButton.svelte'
    import {Utils} from "../utils";
    import Icon from "../../bases/Icon/Icon.svelte";
    let {
        text,
        description
    } = $props()
    let src = Utils.imagesRelativePath + "info-tooltip.svg";
</script>
{text} {description}
<IconButton
        icon="info-tooltip"

    ></IconButton>
<Icon type="info-tooltip" color="transparent" />