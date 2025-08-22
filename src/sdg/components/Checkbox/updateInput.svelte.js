export function updateInput(input, required, invalid, name) {
    if (!input) return;
    input.setAttribute('aria-required', required ? 'true' : "false")
    input.setAttribute('aria-invalid', invalid ? 'true' : "false")
    if (name && !input.hasAttribute('name')) {
        input.setAttribute('name', name)
    }

}