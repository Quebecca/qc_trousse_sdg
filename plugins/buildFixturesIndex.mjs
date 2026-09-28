import fs from 'fs';
import path from 'path';
import { globSync } from 'glob';

// Génère public/fixtures-index.html à partir du gabarit src/doc/_fixtures-index.html :
// un index des fixtures de test groupé par Bases / Composants / Modèles (même taxonomie
// que _nav.html de l'index de doc), chaque entrée pointant vers sa fixture baseline et,
// quand elle existe, sa fixture svelte (les fichiers .test.html produits par
// buildTestFixtures dans public/).
//
// Découverte automatique depuis les sources src/sdg/**/*Test.html : aucune liste à
// maintenir à la main. Le nom public d'une fixture suit la MÊME transformation que
// buildTestFixtures : basename(sans .html).replace('Test','') + '.test.html'.
function buildFixturesIndex({ input, output }) {
    return {
        name: 'build-fixtures-index',
        buildStart() {
            const inputPath = path.resolve(input);
            const srcRoot = path.resolve('src');
            this.addWatchFile(inputPath);
            let html = fs.readFileSync(inputPath, 'utf-8');

            // Taxonomie alignée sur _nav.html : les modèles PIV vivent sous components/
            // mais sont classés « Modèles » dans la doc.
            const classify = (p) => {
                if (p.includes('/bases/') || p.includes('/scss/utilities/')) return 'Bases';
                if (/\/components\/(PivHeader|PivFooter)\//.test(p)) return 'Modèles';
                return 'Composants';
            };

            const entries = {}; // clé: "section|stem" -> { section, label, baseline, svelte }
            for (const p of globSync('sdg/**/*Test.html', { cwd: srcRoot, absolute: true })) {
                this.addWatchFile(p);
                // Fixture INTENTIONNELLEMENT VIDE (commentaire seul, aucun markup) = test
                // volontairement absent (logique interne couverte ailleurs) -> hors index.
                const body = fs.readFileSync(p, 'utf-8').replace(/<!--[\s\S]*?-->/g, '').trim();
                if (!body) continue;
                const base = path.basename(p, '.html');
                let kind, stem;
                if (base.endsWith('SvelteTest')) { kind = 'svelte'; stem = base.slice(0, -'SvelteTest'.length); }
                else if (base.endsWith('BaselineTest')) { kind = 'baseline'; stem = base.slice(0, -'BaselineTest'.length); }
                else if (base.endsWith('Test')) { kind = 'baseline'; stem = base.slice(0, -'Test'.length); }
                else continue;

                const publicName = base.replace('Test', '') + '.test.html';
                const section = classify(p);
                const key = `${section}|${stem.toLowerCase()}`;
                (entries[key] ??= { section, label: stem, baseline: null, svelte: null })[kind] = publicName;
                if (kind === 'baseline') entries[key].label = stem;
            }

            const order = ['Bases', 'Composants', 'Modèles'];
            let list = '';
            for (const section of order) {
                const items = Object.values(entries)
                    .filter((e) => e.section === section)
                    .sort((a, b) => a.label.localeCompare(b.label, 'fr'));
                if (!items.length) continue;
                list += `<section class="fixtures-section">\n  <h2 class="qc-h4">${section}</h2>\n  <ul>\n`;
                for (const e of items) {
                    const baseline = e.baseline
                        ? `<a href="${e.baseline}">baseline</a>`
                        : `<span class="absent">baseline</span>`;
                    const svelte = e.svelte
                        ? `<a href="${e.svelte}">svelte</a>`
                        : `<span class="absent">svelte —</span>`;
                    list += `    <li><span class="name">${e.label}</span>`
                        + `<span class="links">${baseline}${svelte}</span></li>\n`;
                }
                list += `  </ul>\n</section>\n`;
            }

            const marker = '<!-- fixtures-list -->';
            if (!html.includes(marker)) {
                this.warn(`⚠️ Le marqueur "${marker}" est absent de ${path.basename(inputPath)}`);
            }
            html = html.replace(marker, list);

            const outputPath = path.resolve(output);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, html, 'utf-8');
        }
    };
}

export default buildFixturesIndex;
