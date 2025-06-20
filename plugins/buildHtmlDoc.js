import fs from 'fs';
import path from 'path';
import glob from 'glob';

function buildHtmlDoc({ input, output }) {
    return {
        name: 'build-html-doc',
        buildStart() {
            const inputPath = path.resolve(input);
            const srcRoot = path.resolve('src');
            const inputFileName = path.basename(inputPath);
            let html = fs.readFileSync(inputPath, 'utf-8');

            // Recherche tous les fichiers _*.html dans /src
            const partialPaths = glob.sync('**/_*.html', {
                cwd: srcRoot,
                absolute: true,
                ignore: [inputPath] // ignore index.html
            });

            for (const partialPath of partialPaths) {
                const partialName = path.basename(partialPath);
                const marker = `<!-- ${partialName} -->`;
                const content = fs.readFileSync(partialPath, 'utf-8');

                if (html.includes(marker)) {
                    html = html.replace(new RegExp(marker, 'g'), content);
                } else {
                    this.warn(`⚠️ Le partiel "${partialName}" n'est pas utilisé dans ${inputFileName}`);
                }
            }

            const outputPath = path.resolve(output);
            fs.mkdirSync(path.dirname(outputPath), { recursive: true });
            fs.writeFileSync(outputPath, html, 'utf-8');
        }
    };
}

export default buildHtmlDoc;
