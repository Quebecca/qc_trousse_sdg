<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";

    let {
        switchId,
        name,
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
    <span class="qc-switch-label">Lorem ipsum generator</span>
    <input
        id={switchId}
        type="checkbox"
        role="switch"
        {name}
        bind:checked={checked}
        aria-checked={checked}
        {...restProps}
    />
    <span class="qc-switch-slider"></span>
</label>