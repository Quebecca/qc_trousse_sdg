<script>
    import {Utils} from "../utils";
    import {onMount} from "svelte";

    let {
        variant = "primary",
        size,
        type = "button",
        disabled = false,
        ...rest
    } = $props();

    let restProps = $state({});
    let className;

    onMount(() => {
        const [buttonProps] = Utils.computeFieldsAttributes(["button"], {}, rest);
        restProps = {...buttonProps};
        className = [
            "btn",
            variant && `btn-${variant}`,
            size && `btn-${size}`,
        ].filter(Boolean).join(" ");
    });
</script>

<button 
    {type}
    class={className}
    {disabled}
    {...restProps}
>
    <slot></slot>
</button>