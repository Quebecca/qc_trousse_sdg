import { test, expect } from '@playwright/test';
import path = require('path');

test('Tooltip baseline', {
    tag: ['@tooltip', '@baseline']
}, async ({ page }) => {
    const positions = ["top", "right","bottom"]
    const htmlFilePath = path.resolve(__dirname, '../public/tooltipBaseline.test.html');
    for (const position of positions) {
        await page.goto(`file://${htmlFilePath}`);
        // Injection du script dans le contexte du navigateur
        await page.evaluate(prepareSnapshotForPosition, position);
        await expect(page).toHaveScreenshot(`tooltip-${position}.png`, {fullPage: true});
    }
    await page.pause()
    await page.goto(`file://${htmlFilePath}`);
    await page.evaluate(prepareSnapshotForModale);
    await expect(page).toHaveScreenshot(`tooltip-feuille.png`, {fullPage: true});
    await page.pause()
    await page.getByRole('button', { name: 'Fermer l\'aide contextuelle' }).click();
    await page.evaluate(changeIcon, "question");
    await expect(page).toHaveScreenshot(`tooltip-question-mark.png`, {fullPage: true});
});

async function prepareSnapshotForPosition(position) {
    const mainTooltip = document.getElementById("tooltip");
    mainTooltip.text = position;
    mainTooltip.requestedPosition = position
    await new Promise(resolve => setTimeout(resolve, 100));
    const text = mainTooltip.shadowRoot.querySelector('.qc-tooltip-text');
    const len = text.getBoundingClientRect().width;
    // positionnement du tooltip principal au centre de la page
    mainTooltip.style.left = `calc( 50% - ${len}px )`;

    const tooltips = document.querySelectorAll('qc-tooltip');

    for (const el of tooltips) {
        el.requestedPosition = position
        // Interaction avec le bouton dans le shadow DOM
        el.shadowRoot?.querySelector('.qc-tooltip-button').click();
    }
}


async function prepareSnapshotForModale() {
    const mainTooltip = document.getElementById("tooltip");
    mainTooltip.displayMode = "modal";
    mainTooltip.text = "feuille"
    await new Promise(resolve => setTimeout(resolve, 100));

    const text = mainTooltip.shadowRoot.querySelector('.qc-tooltip-text');
    const len = text.getBoundingClientRect().width;
    // positionnement du tooltip principal au centre de la page
    mainTooltip.style.left = `calc( 50% - ${len}px )`;
    mainTooltip.shadowRoot?.querySelector('.qc-tooltip-button').click();

}

async function changeIcon(icon) {
    const mainTooltip = document.getElementById("tooltip");
    mainTooltip.icon = icon;
    mainTooltip.text = `icone ${icon}`
    await new Promise(resolve => setTimeout(resolve, 100));
}






