<script>
    let {
        items,
        passValue = () => {},
        handleExit = () => {}
    } = $props();

    let predecessor = $state();
    let selectedValue = $state();

    const selectedElementCLass = "qc-dropdown-list-single-selected";
    function handleEvent(thisElement, value) {
        if (predecessor) {
            predecessor.classList.toggle(selectedElementCLass,);
        }

        thisElement.classList.toggle(selectedElementCLass);
        predecessor = thisElement;

        selectedValue = value;
        passValue(value);
    }

    function handleKeyDown (event, value, index) {
        if (event.key === "Enter" || event.key === " ") {
            handleEvent(event.target, value);
        }

        if (canExit(event, index)) {
            handleExit();
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (event.key === "Tab" && index === items.length - 1);
    }
</script>

{#each items as item, index}
    <div
        class="qc-dropdown-list-single"
        tabindex="0"
        role="option"
        aria-selected={selectedValue === item.value ? "true" : "false"}
        onclick={(event) => handleEvent(event.target, item.value)}
        onkeydown={(event) => handleKeyDown(event, item.value, index)}
    >
        {item.label}
    </div>
{/each}