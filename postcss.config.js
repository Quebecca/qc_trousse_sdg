// Reprend la chaîne postcss de rollup.config.js (scssOptions.processor) :
// uniquement postcss-replace pour injecter la version du paquet et le drapeau
// dev-env dans le CSS compilé. Pas d'autoprefixer (l'ancien build n'en posait pas).
// Auto-découvert par Vite (build de prod ET serveur dev).
import postcssReplace from 'postcss-replace';
import { readFileSync } from 'node:fs';

const pkg = JSON.parse(readFileSync(new URL('./package.json', import.meta.url), 'utf-8'));

export default {
    plugins: [
        postcssReplace({
            data: {
                'pkg-version': pkg.version,
                // build de prod -> 'false' ; serveur dev (QC_DEV=true) -> 'true'.
                'dev-env': process.env.QC_DEV === 'true' ? 'true' : 'false',
            },
        }),
    ],
};
