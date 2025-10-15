export function updateInput(input, required, invalid, compact, selectionButton, inline, name) {
    if (!input ) return;
    if (input.role === "switch") return;
    let label = input.closest('label');
    input.classList.add('qc-choicefield')
    label.classList.add('qc-choicefield-label')
    input.classList.toggle('qc-selection-button', selectionButton)
    label.classList.toggle('qc-selection-button', selectionButton)
    label.classList.toggle('qc-selection-button-inline', inline)
    input.setAttribute('aria-required', required ? 'true' : "false");
    input.setAttribute('aria-invalid', invalid ? 'true' : "false")
    input.classList.toggle('qc-compact', compact ? compact : selectionButton)
    if (name && !input.hasAttribute('name')) {
        input.setAttribute('name', name)
    }
}

export function onChange(input, setInvalid) {
    input.addEventListener(
        'change',
        () => setInvalid(false)
    )
}