<script>
    let {
        items,
        noOptionsMessage,
        passValue = () => {},
        handleExit = () => {}
    } = $props();

    let predecessor = $state();
    let selectedValue = $state();
    let mouseDownElement = $state(null);

    // $effect(() => {
    //     $inspect(mouseDownElement);
    // });

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

    function handleMouseUp(event, label, value) {
        console.log(mouseDownElement);
        console.log(event.target);
        console.log(event.target === mouseDownElement);
        if (event.target === mouseDownElement) {
            handleEvent(event.target, label, value);
        }
        mouseDownElement = null;

    }

    function handleMouseDown(event) {
        mouseDownElement = event.target;
    }

    function handleKeyDown (event, label, value, index) {
        if (event.key === "Enter" || event.key === " ") {
            handleEvent(event.target, label, value);
        }

        if (canExit(event, index)) {
            handleExit(event.key);
        }
    }

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === items.length - 1);
    }
</script>

{#if items.length > 0}
    {#each items as item, index}
        <div
                id={Math.random().toString(36).substring(2, 15)}
                class="qc-dropdown-list-single"
                tabindex="0"
                role="option"
                aria-selected={selectedValue === item.value ? "true" : "false"}
                onmousedown={(event) => handleMouseDown(event)}
                onmouseup={(event) => handleMouseUp(event, item.label, item.value)}
                onkeydown={(event) => handleKeyDown(event, item.label, item.value, index)}
        >
            {item.label}
        </div>
    {/each}
{:else}
    <div class="qc-dropdown-list-no-options">{noOptionsMessage}</div>
{/if}