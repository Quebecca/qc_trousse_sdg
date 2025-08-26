export function updateInput(input, required, invalid, compact, name) {
    if (!input) return;
    input.classList.add('qc-choicefield')
    input.closest('label').classList.add('qc-choicefield-label')
    input.setAttribute('aria-required', required ? 'true' : "false")
    input.setAttribute('aria-invalid', invalid ? 'true' : "false")
    input.classList.toggle('qc-compact', compact)
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