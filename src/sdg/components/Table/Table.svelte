<script>
    /**
     * Prépare le tableau reçu dans le slot. Le composant ajoute toujours la
     * classe `qc-table` et ajoute `qc-table--structured-list` lorsque la
     * présentation en liste structurée est activée.
     *
     * Lorsque `structuredList` est activé, le composant :
     * - calcule les `data-label` à partir des cellules d’en-tête ;
     * - prend en charge les en-têtes sur plusieurs lignes et les `colspan` ;
     * - crée des clones mobiles pour représenter les cellules avec `rowspan`.
     *
     * Le traitement est exécuté après le rendu initial du `<slot>`. Un
     * `MutationObserver` le relance lorsque le tableau est modifié dynamiquement
     * par une pagination, un tri ou un filtrage sans remontage du composant.
     *
     * L’observer est temporairement déconnecté pendant `applyDataLabels` afin
     * d’ignorer les mutations DOM produites par le traitement lui-même.
     */
    import { tick } from "svelte";
    let { structuredList = false, host } = $props();

    const TABLE_CLASS = "qc-table";
    const STRUCTURED_LIST_CLASS = "qc-table--structured-list";

    $effect(() => {
        const currentHost = host;
        const isStructuredList = structuredList;

        if (!currentHost) return;

        let debounceId;
        let active = true;

        const observer = new MutationObserver(() => {
            // Debounce : un changement de page déclenche souvent plusieurs
            // mutations (suppression des anciennes lignes ,ajout des nouvelles) ;
            // on attend une courte durée avant de relancer le traitement
            clearTimeout(debounceId);
            debounceId = setTimeout(processTable, 30);
        });

        const observerOptions = {
            childList: true,      // ajout/suppression de lignes (pagination)
            subtree: true,        // observe aussi les descendants (tbody > tr > td)
            characterData: true,  // détecte la modification du texte d'un en-tête sans remplacement du noeud DOM
            attributes: true,
            attributeFilter: ["rowspan", "colspan"]
        };
        const processTable = () => {
            observer.disconnect();

            try {
                const table = currentHost.querySelector("table");

                if (!table) return;

                table.classList.add(TABLE_CLASS);
                table.classList.toggle(STRUCTURED_LIST_CLASS, isStructuredList);

                if (isStructuredList) {
                    applyDataLabels(table);
                } else {
                    resetStructuredList(table);
                }
            } finally {
                if (active) {
                    observer.observe(currentHost, observerOptions);
                }
            }
        };

        // --- Traitement initial, au montage du tableau ---
        (async () => {
            await tick(); // s'assure que le DOM du <slot /> est bien rendu
            if (active) processTable();
        })();

        return () => {
            active = false;
            observer.disconnect();
            clearTimeout(debounceId);
        };
    });

    function resetStructuredList(table) {
        // Retirer les éléments générés par un traitement précédent.
        table
            .querySelectorAll("[data-qc-clone]")
            .forEach((clone) => clone.remove());

        table
            .querySelectorAll("[data-qc-header-row]")
            .forEach((row) => row.removeAttribute("data-qc-header-row"));

        table
            .querySelectorAll("[data-label]")
            .forEach((cell) => cell.removeAttribute("data-label"));
    }

    function applyDataLabels(table) {
        resetStructuredList(table);

        const numHeaderRows = getAndMarkHeaderRows(table);
        const rows = Array.from(table.rows);

        if (!rows.length) return;

        const grid = buildTableGrid(rows);
        processBodyRows(rows, grid, numHeaderRows);
    }
    /**
     * Identifie les lignes d’en-tête du tableau.
     *
     * Si un <thead> est présent, retourne simplement le nombre de lignes
     * qu’il contient.
     *
     * Sinon, considère comme lignes d’en-tête les premières lignes du tableau
     * composées uniquement de cellules <th>. Ces lignes sont marquées avec
     * l’attribut `data-qc-header-row` afin de pouvoir les traiter comme un
     * en-tête, notamment pour l’affichage mobile.
     *
     * La détection s’arrête dès qu’une ligne contient une cellule autre que <th>.
     */
    function getAndMarkHeaderRows(table) {
        if (table.tHead) return table.tHead.rows.length;

        const rows = Array.from(table.rows);
        let count = 0;

        for (const row of rows) {
            const cells = Array.from(row.cells);
            const isAllHeaderCells = cells.length > 0 && cells.every((cell) => cell.tagName === "TH");
            if (!isAllHeaderCells) break;

            row.setAttribute("data-qc-header-row", "true");
            count++;
        }

        return count;
    }

    /**
     * Construit une grille représentant les positions réelles des cellules
     * d’un tableau, en tenant compte des rowspan et colspan.
     *
     * Chaque position grid[ligne][colonne] contient la cellule DOM
     * qui occupe cet emplacement.
     */
    function buildTableGrid(rows) {
        const grid = [];

        rows.forEach((row, rowIndex) => {
            grid[rowIndex] ??= [];

            let columnIndex = 0;

            Array.from(row.cells).forEach((cell) => {
                // Ignore les positions déjà occupées par un rowspan précédent.
                while (grid[rowIndex][columnIndex]) {
                    columnIndex++;
                }

                const rowSpan = cell.rowSpan || 1;
                const columnSpan = cell.colSpan || 1;

                placeCellInGrid(grid, cell, rowIndex, columnIndex, rowSpan, columnSpan);

                // La prochaine cellule commence après le colspan actuel.
                columnIndex += columnSpan;
            });
        });

        return grid;
    }

    /**
     * Place une cellule dans toutes les positions qu’elle occupe.
     */
    function placeCellInGrid(grid, cell, startRow, startColumn, rowSpan, columnSpan) {
        for (let rowOffset = 0; rowOffset < rowSpan; rowOffset++) {
            const targetRow = startRow + rowOffset;

            grid[targetRow] ??= [];

            for (
                let columnOffset = 0;
                columnOffset < columnSpan;
                columnOffset++
            ) {
                const targetColumn = startColumn + columnOffset;

                grid[targetRow][targetColumn] = cell;
            }
        }
    }

    /**
     * Traite toutes les lignes du corps du tableau.
     *
     * Pour chaque ligne :
     * - ajoute les data-label sur les cellules ;
     * - insère les clones nécessaires pour représenter les rowspan en mobile.
     */
    function processBodyRows(rows, grid, numHeaderRows) {
        rows.forEach((row, rowIndex) => {
            if (rowIndex < numHeaderRows) {
                return;
            }

            const { cells, hasClones } = buildRowCells(row, grid, rowIndex, numHeaderRows);

            if (hasClones) {
                reorderCellsWithClones(row, cells);
            }
        });
    }

    /**
     * Construit la liste des cellules qui devront composer la ligne.
     *
     * Les cellules héritées d'un rowspan sont remplacées
     * par un clone destiné à l'affichage mobile.
     */
    function buildRowCells(row, grid, rowIndex, numHeaderRows) {
        const visitedCells = new Set();
        const orderedCells = [];
        let hasClones = false;

        (grid[rowIndex] || []).forEach((cell, columnIndex) => {
            if (!cell || visitedCells.has(cell)) { // cellules deja traité
                return;
            }

            visitedCells.add(cell);

            let targetCell = cell;

            if (cell.parentNode !== row) {
                // la cellule de la grille complète "grid" n'appartient pas à la ligne row de la grille DOM
                // on crée un clone pour le mobile
                targetCell = createClone(cell);
                hasClones = true;
            }

            applyCellLabel( targetCell, grid, numHeaderRows, columnIndex, cell.colSpan || 1);

            orderedCells.push(targetCell);
        });

        return {
            cells: orderedCells,
            hasClones
        };
    }

    /**
     * Calcule et applique le data-label d'une cellule.
     */
    function applyCellLabel(cell, grid, numHeaderRows, columnIndex, colspan) {
        const label = labelForRange(grid, numHeaderRows, columnIndex, colspan);

        if (label) {
            cell.setAttribute("data-label", label);
        }
    }

    /**
     * Réordonne les cellules dans le DOM selon l'ordre logique de la grille.
     *
     * appendChild déplace une cellule déjà présente dans la ligne (elle n'est
     * pas dupliquée) et ajoute les clones nouvellement créés à leur position.
     * Les cellules d'origine changent donc aussi de position, pas seulement
     * les clones.
     */
    function reorderCellsWithClones(row, cells) {
        cells.forEach((cell) => row.appendChild(cell));
    }

    /**
     * Crée la cellule clone représentant une cellule source héritée par
     * rowspan : masquée en desktop, affichée en mobile.
     */
    function createClone(sourceCell) {
        const clone = document.createElement(sourceCell.tagName.toLowerCase());

        clone.innerHTML = sourceCell.innerHTML;

        clone.setAttribute("data-qc-clone", "true");

        const scope = sourceCell.getAttribute("scope");
        if (clone.tagName === "TH" && scope) clone.setAttribute("scope", scope);
        if (sourceCell.colSpan > 1) clone.colSpan = sourceCell.colSpan;

        return clone;
    }

    /**
     * Construit le libellé correspondant à une cellule du tbody.
     *
     * Pour chaque niveau d'en-tête, on récupère les textes des colonnes couvertes
     * par la cellule, on élimine les doublons, puis on concatène les différents
     * niveaux d'en-têtes.
     */
    function labelForRange(grid, numHeaderRows, startCol, colspan) {
        const headerLevels = [];

        for (let rowIndex = 0; rowIndex < numHeaderRows; rowIndex++) {
            const levelTexts = [];

            for (
                let columnIndex = startCol;
                columnIndex < startCol + colspan;
                columnIndex++
            ) {
                const headerCell = grid[rowIndex]?.[columnIndex];
                const headerText = headerCell?.textContent.trim();

                if (!headerText || levelTexts.includes(headerText)) {
                    continue;
                }

                levelTexts.push(headerText);
            }

            if (levelTexts.length > 0) {
                headerLevels.push(levelTexts.join(" / "));
            }
        }

        return removeDuplicateLevels(headerLevels).join(" - ");
    }

    /**
     * Supprime les niveaux identiques consécutifs.
     */
    function removeDuplicateLevels(levels) {
        return levels.filter(
            (level, index) => level !== levels[index - 1]
        );
    }
</script>

<slot />
