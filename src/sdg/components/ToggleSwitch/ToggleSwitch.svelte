<script>
    import {onMount} from "svelte";
    import {Utils} from "../utils";

    let {
        name,
        handleOnChange,
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
        type="checkbox"
        role="switch"
        {name}
        bind:checked={checked}
        aria-checked={checked}
        onchange={handleOnChange}
        {...restProps}
    />
    <span class="qc-switch-slider"></span>
</label>