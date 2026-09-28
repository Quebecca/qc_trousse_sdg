# Tests visuels (Playwright) — trousse SDG

## Deux commandes

| Commande | Où | Usage |
|----------|-----|-------|
| `yarn fastest` | **local natif** (rapide) | Boucle de développement au quotidien. |
| `yarn test` | **conteneur** Playwright (Linux) | La **vérité** : rendu identique pour toute l'équipe. À jouer **avant de pousser / livrer**. Requiert Docker (OrbStack convient). |

Les deux acceptent les arguments Playwright habituels :

```bash
yarn fastest tests/table-baseline.spec.ts   # un sous-ensemble
yarn fastest --project=chromium              # un seul navigateur
yarn test -g @table                          # filtre par tag, dans le conteneur
```

## Rapport HTML et mode non interactif (`-n`)

Le reporter est conditionnel (voir `playwright.config.ts`) :

| Invocation | Reporter | Rapport HTML |
|------------|----------|--------------|
| `yarn fastest` / `yarn test` (défaut) | `list` + `html` (`open:'never'`) | **écrit** dans `playwright-report/`, **sans** lancer de serveur |
| `yarn fastest -n` (ou tout passage de `-n`) | `list` seul | **aucun** dossier HTML |

- Le rapport HTML est **toujours généré** en mode défaut, mais le serveur n'est
  **jamais** ouvert automatiquement (il bloquerait un terminal non interactif).
  On le consulte après coup :

  ```bash
  yarn playwright show-report
  ```

- `-n` (posé par le wrapper `scripts/run-tests.mjs` → `PW_NO_HTML=1`) donne un
  run **`list` pur**, sans dossier HTML : pour un agent, la CI, ou tout terminal
  non interactif où le serveur de rapport bloquerait.
- Dans le conteneur (`yarn test`), le rapport est écrit dans le
  `playwright-report/` **monté** sur l'hôte ; on ne lance jamais de serveur
  *dans* le conteneur (il serait impossible à arrêter) — on le consulte depuis
  l'hôte avec `show-report`.

## Déterminisme et parallélisme

Hors CI, Playwright tourne **en parallèle** sur tous les cœurs
(`workers: process.env.CI ? 1 : undefined`). Un test visuel dont le rendu dépend
du **timing** ou de la **hauteur du viewport** — p. ex. une liste déroulante qui
calcule sa direction d'ouverture (haut/bas), ou une capture `fullPage` qui
redimensionne le viewport — peut alors **flaker** sous la charge : la capture
tombe à cheval sur un reflow, et le sens/rendu bascule d'un run à l'autre.

> ⚠️ **Le parallélisme peut faire échouer des tests** de façon non déterministe
> (surtout sous forte charge machine). **En cas de plantage, relancer avec moins
> de workers** — voire un seul :
>
> ```bash
> yarn test --workers=1              # toute la suite, en série (le plus sûr)
> yarn test --workers=2              # compromis vitesse/stabilité
> yarn test -g @textwrap --workers=1 # cibler le test qui a planté
> ```
>
> **Flux recommandé (rapide puis fiable)** : lancer la suite en parallèle, puis
> **ne rejouer que les échecs** en série. `--last-failed` ne relance que les
> tests tombés au run précédent :
>
> ```bash
> yarn test --workers=6                 # 1er passage, rapide (parallèle)
> yarn test --last-failed --workers=1   # rejeu des SEULS échecs, en série
> ```
>
> Un échec qui **disparaît** au rejeu `--workers=1` n'est pas une régression de
> la trousse : c'est une race induite par la charge. S'il **persiste** à 1
> worker, c'est un vrai diff (ou un test à rendre déterministe).

Pour **reproduire / diagnostiquer** (ou stabiliser) un test visuel instable,
jouer en série avec répétitions :

```bash
yarn test -g @textwrap --workers=1 --repeat-each=10
```

Si ça passe en `--workers=1` mais rate en parallèle → race induite par la charge.

> **Principe** : on préfère un **design de fixture qui ne peut pas décaler**
> (hauteur de ligne fixe, `white-space: nowrap`, pas de dépendance à la hauteur
> du viewport) plutôt que d'ajouter des attentes de chargement dans le test.
> Une attente masque le symptôme ; un design plat supprime la cause.

## Baselines : double plateforme

Les snapshots sont versionnés (Git LFS) pour **deux plateformes** :

- `*-darwin.png` — rendu macOS, comparé par `yarn fastest` sur Mac.
- `*-linux.png` — rendu Linux (conteneur), comparé par `yarn test` et à la livraison.

`snapshotPathTemplate` (dans `playwright.config`) sélectionne automatiquement la
bonne plateforme selon l'OS d'exécution. Le rendu pixel diffère légèrement entre
macOS et Linux (anti-crénelage des polices, ~1–2 %) : c'est pourquoi on conserve
une baseline par plateforme plutôt qu'une tolérance.

## Quand tu modifies le visuel d'un composant

Régénère **les deux** plateformes, puis commite les deux jeux :

```bash
# 1. baseline locale (macOS)
yarn fastest -u

# 2. baseline Linux (conteneur = référence partagée)
yarn test --update-snapshots

# 3. commiter les deux
git add tests/snapshots/
```

> Ne commite pas seulement le darwin : la baseline **Linux** est celle qui fait
> foi avant livraison. Si tu oublies de régénérer le Linux, `yarn test` échouera.

## Avant de pousser / livrer

`yarn test` (conteneur) doit être **vert**. C'est le rendu de référence commun à
toute l'équipe, indépendant de ton poste.

## Prérequis & détails du conteneur

- **Docker** requis pour `yarn test` (OrbStack fonctionne). L'image
  `mcr.microsoft.com/playwright:v<version>-noble` (version alignée sur
  `package.json`) est tirée automatiquement (~1–2 Go la première fois).
- Plateforme figée en `linux/amd64` (rendu déterministe entre postes Intel et
  Apple Silicon) — surchargeable via `PW_PLATFORM=linux/arm64` si besoin.
- Le `node_modules` de l'hôte n'est **jamais** réutilisé dans le conteneur
  (binaires natifs macOS ≠ Linux) : volume dédié + `yarn install` interne. Le
  cache yarn est partagé entre worktrees, donc les réinstallations restent rapides.
- Multi-worktree : chaque run est éphémère (`--rm`) et lit les fichiers du
  répertoire courant ; plusieurs worktrees peuvent tourner en parallèle sans
  conflit (tests en `file://`, aucun port).
