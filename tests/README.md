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
