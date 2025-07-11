<script>
    let {
        items,
        noOptionsMessage,
        passValue = () => {},
        handleExit = () => {}
    } = $props();

    let predecessor = $state();
    let selectedValue = $state();

    const selectedElementCLass = "qc-dropdown-list-single-selected";
    function handleEvent(thisElement, label, value) {
        if (predecessor) {
            predecessor.classList.toggle(selectedElementCLass);
        }

        thisElement.classList.toggle(selectedElementCLass);
        predecessor = thisElement;

        selectedValue = value;
        passValue(label, value);
    }

    function handleKeyDown (event, label, value, index) {
        if (event.key === "Enter" || event.key === " ") {
            handleEvent(event.target, label, value);
        }

        if (canExit(event, index)) {
            handleExit();
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (event.key === "Tab" && index === items.length - 1);
    }
</script>

{#if items.length > 0}
    {#each items as item, index}
        <div
                class="qc-dropdown-list-single"
                tabindex="0"
                role="option"
                aria-selected={selectedValue === item.value ? "true" : "false"}
                onclick={(event) => handleEvent(event.target, item.label, item.value)}
                onkeydown={(event) => handleKeyDown(event, item.label, item.value, index)}
        >
            {item.label}
        </div>
    {/each}
{:else}
    <div class="qc-dropdown-list-no-options">{noOptionsMessage}</div>
{/if}