document
    .querySelectorAll('qc-doc-exemple')
    .forEach(ex => {
        let id = ex.getAttribute('code-target-id')
        let codeElement = id
            ? document.getElementById(id)
            : ex;
        ex.rawCode = codeElement.innerHTML;
    })