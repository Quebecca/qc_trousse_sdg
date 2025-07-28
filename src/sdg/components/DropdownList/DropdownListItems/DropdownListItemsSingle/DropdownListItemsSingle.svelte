<script>
    import {Utils} from "../../../utils";

    const selectedElementCLass = "qc-dropdown-list-single-selected";

    let {
        items,
        passValue = () => {},
        handleExit = () => {},
        focusOnOuterElement = () => {},
        handlePrintableCharacter = () => {}
    } = $props();

    let self = $state();
    let listElements = $derived(self ? Array.from(self.querySelectorAll("li")) : []);
    let selectedValue = $derived(items && items.length > 0 ? items.find((item) => item.checked)?.value : null);
    let selectedElement = $derived.by(() => {
        if (selectedValue && listElements && listElements.length > 0) {
            return listElements.find(element => element.value == selectedValue);
        }
        return null;
    });
    let previousElement = $state();

    let mouseDownElement = null;
    let hoveredElement = null;

    $effect(() => {
        if (!selectedElement) {
            return;
        }

        if (previousElement && previousElement !== selectedElement) {
            console.log(previousElement, "previousElement");
            previousElement.classList.remove(selectedElementCLass);
        }

        selectedElement.classList.add(selectedElementCLass);
        previousElement = selectedElement;
    });

    $effect(() => {
        console.log(items.map(item => item.checked));
    })
    $effect(() => {
        console.log(selectedElement, "selectedElement");
    })


    export function focusOnFirstElement() {
        if (listElements && listElements.length > 0) {
            listElements[0].focus();
        }
    }

    export function focusOnLastElement() {
        if (listElements && listElements.length > 0) {
            listElements[listElements.length - 1].focus();
        }
    }

    export function focusOnFirstMatchingElement(value) {
        if (listElements && listElements.length > 0) {
            const foundElement = listElements.find(
                element => element.value.toString().toLowerCase().includes(value.toLowerCase())
            );
            if (foundElement) {
                foundElement.focus();
            }
        }
    }

    function handleSelection(event, item) {
        event.preventDefault();
        passValue(item.label, item.value);

        if (previousElement) {
            items.find(item => item.value == previousElement.value).checked = false;
        }
        item.checked = true;
    }

    function handleMouseUp(event, item) {
        if (event.target === hoveredElement && event.target === mouseDownElement) {
            handleSelection(event, item);
        }
    }

    function handleMouseDown(event) {
        mouseDownElement = event.target;
    }

    function handleComboKey(event, index, item) {
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

        if (event.key === "Enter" || event.key === " ") {
            handleSelection(event, item);
        }

        Utils.sleep(5).then(() => {
            if (canExit(event, index)) {
                handleExit(event.key);
            }
        }).catch(console.error);
    }

    function handleKeyDown (event, index, item) {
        if (event.key.match(/^\w$/i)) {
            handlePrintableCharacter(event);
        } else {
            handleComboKey(event, index, item);
        }
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
                value={item.value}
                class="qc-dropdown-list-single"
                tabindex="0"
                role="option"
                aria-selected={selectedValue === item.value ? "true" : "false"}
                onmousedown={(event) => handleMouseDown(event)}
                onmouseup={(event) => handleMouseUp(event, item)}
                onmouseenter={(event) => hoveredElement = event.target}
                onmouseleave={() => hoveredElement = null}
                onkeydown={(event) => handleKeyDown(event, index, item)}
            >
                {@html item.label}
            </li>
        {/each}
    </ul>
{/if}