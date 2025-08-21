export function updateInput(input, required, invalid) {
    if (!input) return;
    input.setAttribute('aria-required', required ? 'true' : "false")
    input.setAttribute('aria-invalid', invalid ? 'true' : "false")
}