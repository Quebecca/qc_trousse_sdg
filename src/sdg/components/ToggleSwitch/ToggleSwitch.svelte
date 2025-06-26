<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";

    let {
        switchId,
        name,
        label,
        checked = $bindable(false),
        ...rest
    } = $props();

    let restProps = $state({});
    onMount(() => {
        const [inputProps] = Utils.computeFieldsAttributes(["switch"], {}, rest);

        restProps = {...inputProps};
    });
</script>

<label class="qc-switch">
    <input
        id={switchId}
        type="checkbox"
        role="switch"
        {name}
        bind:checked={checked}
        aria-checked={checked}
        {...restProps}
    />
    <span class="qc-switch-label">{@html label}</span>
    <span class="qc-switch-slider"></span>
</label>