import fs from 'fs';
import path from 'path';
import glob from 'glob';

function buildHtmlDoc({ input }) {
    return {
        name: 'build-dev-doc',
        buildStart() {
            const inputPath = path.resolve(input);
            const srcRoot = path.resolve('src');
            const publicRoot = path.resolve('public');
            const inputFileName = path.basename(inputPath);
            let html = fs.readFileSync(inputPath, 'utf-8');

            this.addWatchFile(inputPath);

            const partialPaths = glob.sync('sdg/**/_*.html', {
                cwd: srcRoot,
                absolute: true,
            });
            const partialMarker = `<!-- _partial.html -->`;
            const relativePathMarker = `--relativePath--`;
            for (const partialPath of partialPaths) {
                this.addWatchFile(partialPath);
                const partialName = path.basename(partialPath, ".html")
                const partialDir = path.dirname(partialPath);
                const relativePath = path.relative(partialDir, publicRoot);
                const content = fs.readFileSync(partialPath, 'utf-8');
                const outputPath = partialDir + "/" + partialName.replace("_", "") + ".dev.html"
                fs.writeFileSync(outputPath
                    , html
                        .replace(new RegExp(partialMarker, 'g'), content)
                        .replace(new RegExp(relativePathMarker, 'g'), relativePath)
                    , 'utf-8');
            }
        }
    };
}

export default buildHtmlDoc;
