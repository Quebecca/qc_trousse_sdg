export function updateInput(host, required, invalid, name, disabled) {
    host.querySelectorAll('input')
        .forEach(input => {
        input.setAttribute('aria-required', required ? 'true' : 'false')
        input.setAttribute('aria-invalid', invalid ? 'true' : 'false')
        if (name && !input.hasAttribute('name')) {
            input.setAttribute('name', name)
        }

    })
}