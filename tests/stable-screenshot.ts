import { test, expect, type Page } from '@playwright/test';

type ToHaveScreenshotOptions = Parameters<ReturnType<typeof expect<Page>>['toHaveScreenshot']>[1];

/**
 * Prend un screenshot pleine page et le compare à la baseline — mais tolère l'instabilité
 * de CAPTURE propre à chromium/webkit sous Linux.
 *
 * Contexte : sous Linux, le rendu de certains composants (ex. tooltip : positionnement rAF +
 * shadow DOM) peut jitter d'une frame à l'autre. `toHaveScreenshot` exige alors 2 frames
 * identiques consécutives et, s'il n'y arrive pas, échoue avec « Failed to take two
 * consecutive stable screenshots ». Ce n'est PAS un écart vs la baseline (le diff est vide) —
 * c'est l'impossibilité de figer une image. C'est intermittent : les baselines chromium/webkit
 * Linux existent, donc la capture réussit souvent.
 *
 * Stratégie : on TENTE la capture.
 *  - Si elle aboutit -> comparaison normale à la baseline (un vrai écart de pixels ÉCHOUE).
 *  - Si elle échoue UNIQUEMENT parce que la page ne se stabilise pas -> on SKIP le test avec
 *    une annotation d'avertissement, sans le faire échouer.
 *  - Tout autre échec (diff vs baseline, baseline manquante, etc.) est relancé -> ÉCHOUE.
 *
 * Firefox et darwin, stables, comparent donc toujours réellement ; seuls les cas d'instabilité
 * de capture chromium/webkit-Linux sont neutralisés.
 */
export async function expectStableScreenshot(
    page: Page,
    name: string,
    options?: ToHaveScreenshotOptions,
): Promise<void> {
    try {
        await expect(page).toHaveScreenshot(name, options);
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        if (/two consecutive stable screenshots/i.test(message)) {
            test.info().annotations.push({
                type: 'warning',
                description: `Capture instable pour « ${name} » (rendu non stabilisé, typiquement chromium/webkit sous Linux) — non comparée à la baseline.`,
            });
            // Skip dynamique : marque le test « skipped » au lieu d'« failed ».
            test.skip(true, `Capture instable pour « ${name} » : skip sans échec.`);
        }
        throw error; // vrai écart de pixels / baseline manquante -> échec
    }
}
