import fs from 'fs';
import path from 'path';
import glob from 'glob';

function buildHtmlDoc({ input }) {
    return {
        name: 'build-test-fixtures',
        buildStart() {
            const inputPath = path.resolve(input);
            const srcRoot = path.resolve('src');
            const publicRoot = path.resolve('public');
            const inputFileName = path.basename(inputPath);
            let html = fs.readFileSync(inputPath, 'utf-8');

            this.addWatchFile(inputPath);

            const partialPaths = glob.sync('sdg/**/*Test.html', {
                cwd: srcRoot,
                absolute: true,
            });
            const partialMarker = `<!-- _partial.html -->`;
            const relativePathMarker = `--relativePath--`;
            for (const partialPath of partialPaths) {
                this.addWatchFile(partialPath);
                const partialName = path.basename(partialPath, ".html")
                const content = fs.readFileSync(partialPath, 'utf-8');
                const outputPath = publicRoot + "/" + partialName.replace('Test', '') + ".test.html"
                fs.writeFileSync(outputPath
                    , html
                        .replace(new RegExp(partialMarker, 'g'), content)
                    , 'utf-8');
            }
        }
    };
}

export default buildHtmlDoc;
