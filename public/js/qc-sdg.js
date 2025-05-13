(function () {
    'use strict';

    const isDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isDarkMode) {
        document.documentElement.classList.add('qc-dark-theme');
    }

})();
