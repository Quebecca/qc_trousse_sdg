<svelte:options customElement="{{
    tag: 'qc-color-doc'
    , props: {
        color : {attribute: 'target-id'},
        rawCode : {attribute: 'raw-code'},
    }
}}" />
<script>
    /**
     * @typedef {Object} Props
     * @property {any} title
     * @property {any} token
     * @property {any} [border]
     */

    /** @type {Props} */
    let { title, token, border = null } = $props();

</script>
<div class="color-details">
    <div class="color-sample qc-bg-color-{token.split(',')[0]}"
         class:border={border}></div>
    <div class="color-description">
        <strong>{title}</strong><br/>
        <code>{token.split(',').map(part => '--qc-color-' + part.trim()).join(', ')}</code>
    </div>
</div>
<style lang="scss">
    @use "base/colors";
    .color-details {
        display: flex;
        justify-content: flex-start;
        align-items: center;
        > div + div {
            margin-left: token-value(spacer,md);
        }
    }

    .color-sample {
        width: rem(6 * $base-spacer);
        height: rem(6 * $base-spacer);
        border-radius: 50%;
        flex-shrink: 0;
    }
    .border {
      border: 1px solid token-value(color grey light);
    }
</style>