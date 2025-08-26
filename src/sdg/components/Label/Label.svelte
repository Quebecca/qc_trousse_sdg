<script>
    import LabelText from "./LabelText.svelte";

    let {
        forId,
        text,
        required = false,
        compact = false,
        bold = false,
        disabled = false,
        rootElement = $bindable(),
        ...rest
    } = $props();
</script>

<label
    bind:this={rootElement}
    for={forId}
    class={[
        "qc-label",
        compact && "qc-compact",
        bold && "qc-bold",
        disabled && "qc-disabled"
    ]}
    {...rest}
>
    <LabelText {text} {required} />
</label>
