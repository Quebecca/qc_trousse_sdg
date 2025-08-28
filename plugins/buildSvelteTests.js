import fs from 'fs';
import path from 'path';
import glob from 'glob';

function buildSvelteTests({input, ignorePathsFile}) {
    return {
        name: "build-svelte-tests",
        buildStart() {
            const testsRoot = path.resolve(input);
            const resolvedIgnorePathsFile = ignorePathsFile ? `${testsRoot}/${ignorePathsFile}` : null;
            const ignorePaths = resolvedIgnorePathsFile ?
                JSON.parse(fs.readFileSync(resolvedIgnorePathsFile, 'utf-8'))
                : [];

            const partialPaths = glob.sync('**/*-baseline.spec.ts', {
                cwd: testsRoot,
                absolute: true,
                ignore: ignorePaths
            });

            partialPaths.forEach(partialPath => {
                this.addWatchFile(partialPath);

                let testCode = fs.readFileSync(partialPath, 'utf-8');

                testCode = testCode.replace(/Baseline\.test\.html/g, "Svelte.test.html");
                testCode = testCode.replace(/baseline/g, "svelte");

                const outputPath = partialPath.replace(/-baseline\.spec\.ts/g, "-svelte.spec.ts");
                fs.writeFileSync(outputPath, testCode, 'utf-8');
            });
        }
    }
}

export default buildSvelteTests;
