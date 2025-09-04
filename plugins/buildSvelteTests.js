import fs from 'fs';
import path from 'path';
import glob from 'glob';

function buildSvelteTests({input, ignorePaths: ignorePaths = []}) {
    return {
        name: "build-svelte-tests",
        buildStart() {
            const testsRoot = path.resolve(input);
            const ignorePathComment = "// buildSvelteTests-ignore";

            const partialPaths = glob.sync('**/*Baseline.spec.ts', {
                cwd: testsRoot,
                absolute: true,
                ignore: ignorePaths
            });

            partialPaths.forEach(partialPath => {
                this.addWatchFile(partialPath);

                let testCode = fs.readFileSync(partialPath, 'utf-8');
                if (testCode.includes(ignorePathComment)) {
                    return;
                }

                testCode = testCode.replace(/Baseline\.test\.html/g, "Svelte.test.html");
                testCode = testCode.replace(/baseline/g, "svelte");

                const outputPath = partialPath.replace(/Baseline\.spec\.ts/g, "Svelte.spec.ts");
                fs.writeFileSync(outputPath, testCode, 'utf-8');
            });
        }
    }
}

export default buildSvelteTests;
