<script>
import {Utils} from "../utils";
import Icon from "../Icon/Icon.svelte";

let {invalid , invalidText} = $props();

</script>

<div class="qc-form-error"
     role="alert">
    {#if invalid}
        <Icon
                type="warning"
                color="red-regular"
                width="var(--error-icon-width)"
                height="var(--error-icon-height)"
        />
        <span>{invalidText}</span>
    {/if}
</div>