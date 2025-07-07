<script>
    let { items } = $props();

    let predecessor = $state();
    let selectedValue = $state();

    const selectedElementCLass = "qc-dropdown-list-single-selected";
    function handleEvent(thisElement, value) {
        console.log(predecessor);
        if (predecessor) {
            predecessor.classList.toggle(selectedElementCLass,);
        }

        thisElement.classList.toggle(selectedElementCLass);
        predecessor = thisElement;

        selectedValue = value;
        console.log(selectedValue);
    }

    function handleKeyDown (event, value) {
        if (event.key === 'Enter' || event.key === ' ') {
            handleEvent(event.target, value);
        }
    }
</script>

{#each items as item}
    <div
        class="qc-dropdown-list-single"
        tabindex="0"
        role="option"
        aria-selected="{selectedValue === item.value ? 'true' : 'false'}"
        onclick={(event) => handleEvent(event.target, item.value)}
        onkeydown={(event) => handleKeyDown(event, item.value)}
    >
        {item.label}
    </div>
{/each}