<script>
import {Utils} from "../utils";
import Icon from "../Icon/Icon.svelte";

let {invalid , invalidText, id} = $props();

</script>

<div class="qc-form-error"
     role="alert"
     {id}>
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