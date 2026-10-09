// Wrapper de `playwright test` avec un mode NON INTERACTIF (-n).
//
// Sans -n : le reporter par défaut (voir playwright.config.ts) écrit un rapport
//   HTML dans playwright-report/ AVEC open:'never' — jamais de serveur bloquant.
//   On le consulte après coup via `yarn playwright show-report`. La sortie `list`
//   défile aussi en direct.
// Avec -n : pose PW_NO_HTML=1 -> reporter `list` seul, aucun dossier HTML. Pour un
//   run CI/agent pur où le rapport HTML est superflu.
//
// Le reste des arguments est transmis tel quel à Playwright (--grep, --project,
// --update-snapshots, chemins de specs, etc.).
import { spawn } from 'node:child_process';

const raw = process.argv.slice(2);
const nonInteractive = raw.includes('-n');
const passthrough = raw.filter((a) => a !== '-n');

const env = { ...process.env };
if (nonInteractive) {
    env.PW_NO_HTML = '1';
}

const args = ['playwright', 'test', ...passthrough];
const child = spawn('yarn', args, { stdio: 'inherit', env });
child.on('exit', (code, signal) => {
    if (signal) process.kill(process.pid, signal);
    else process.exit(code ?? 0);
});
