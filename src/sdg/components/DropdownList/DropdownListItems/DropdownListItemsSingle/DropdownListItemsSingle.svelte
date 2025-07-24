<script>
    import {Utils} from "../../../utils";

    let {
        items,
        passValue = () => {},
        handleExit = () => {},
        focusOnOuterElement = () => {}
    } = $props();

    let self = $state();
    let listElements = $derived(self.querySelectorAll("li"));
    let predecessor = $state();
    let selectedValue = $state();
    let mouseDownElement = null;
    let hoveredElement = null;

    const selectedElementCLass = "qc-dropdown-list-single-selected";

    export function focusOnFirstElement() {
        if (listElements.length > 0) {
            listElements[0].focus();
        }
    }

    function handleSelection(thisElement, label, value) {
        if (predecessor) {
            predecessor.classList.toggle(selectedElementCLass);
        }

        thisElement.classList.toggle(selectedElementCLass);
        predecessor = thisElement;

        selectedValue = value;
        passValue(label, value);
    }

    function handleMouseUp(event, label, value) {
        if (event.target === hoveredElement && event.target === mouseDownElement) {
            handleSelection(event.target, label, value);
        }
    }

    function handleMouseDown(event) {
        mouseDownElement = event.target;
    }

    function handleKeyDown (event, label, value, index) {
        if (event.key === "ArrowDown") {
            event.preventDefault();
            event.stopPropagation();

            if (listElements.length > 0 && index < items.length - 1) {
                listElements[index + 1].focus();
            }
        }

        if (event.key === "ArrowUp") {
            event.preventDefault();
            event.stopPropagation();

            if (listElements.length > 0 && index > 0) {
                listElements[index - 1].focus();
            } else {
                focusOnOuterElement();
            }
        }

        Utils.sleep(5).then(() => {
            if (canExit(event, index)) {
                handleExit(event.key);
            }

            if (event.key === "Enter" || event.key === " ") {
                handleSelection(event.target, label, value);
            }
        }).catch(console.error);
    }

    function canExit(event, index) {
        return event.key === "Escape" || (!event.shiftKey && event.key === "Tab" && index === items.length - 1);
    }
</script>

{#if items.length > 0}
    <ul bind:this={self}>
        {#each items as item, index}
            <li
                    id={Math.random().toString(36).substring(2, 15)}
                    class="qc-dropdown-list-single"
                    tabindex="0"
                    role="option"
                    aria-selected={selectedValue === item.value ? "true" : "false"}
                    onmousedown={(event) => handleMouseDown(event)}
                    onmouseup={(event) => handleMouseUp(event, item.label, item.value)}
                    onmouseenter={(event) => hoveredElement = event.target}
                    onmouseleave={() => hoveredElement = null}
                    onkeydown={(event) => handleKeyDown(event, item.label, item.value, index)}
            >
                {@html item.label}
            </li>
        {/each}
    </ul>
{/if}