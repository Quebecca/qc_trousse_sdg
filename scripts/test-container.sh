#!/usr/bin/env bash
#
# test-container.sh — joue la suite Playwright de la trousse dans le conteneur
# officiel Playwright, pour un rendu de snapshots identique quel que soit le poste
# (baseline unique, plateforme figée). Aucun docker-compose requis.
#
# Usage :
#   scripts/test-container.sh [args playwright...]
#   scripts/test-container.sh                          # toute la suite
#   scripts/test-container.sh tests/table-*.spec.ts    # un sous-ensemble
#   scripts/test-container.sh --update-snapshots       # (re)génère les baselines
#   scripts/test-container.sh -g @table                # filtrer par tag
#
# Détails :
# - L'image Playwright suit la version de package.json (aucune dérive possible).
# - Rendu figé en linux/amd64 (surchargable via PW_PLATFORM) pour rester
#   déterministe entre postes Intel et Apple Silicon, et avec une future CI amd64.
# - node_modules de l'hôte JAMAIS réutilisé (binaires natifs macOS vs Linux) :
#   volume anonyme + install dans le conteneur. Le cache yarn est partagé entre
#   worktrees via un volume nommé, donc le réinstall reste rapide.
# - Multi-worktree : chaque exécution est lancée depuis son propre répertoire et
#   est éphémère (--rm) ; les tests sont en file:// (aucun port), donc plusieurs
#   worktrees tournent en parallèle sans conflit.
# - PLAYWRIGHT_HTML_OPEN=never : jamais de serveur de rapport bloquant.
#
set -euo pipefail

cd "$(git -C "$(dirname "$0")" rev-parse --show-toplevel)"

if ! command -v docker >/dev/null 2>&1; then
  echo "✖ Docker introuvable. Installe Docker Desktop (ou colima) puis relance." >&2
  exit 127
fi

PW_VERSION="$(node -p "(require('./package.json').devDependencies||{})['@playwright/test'] || (require('./package.json').dependencies||{})['@playwright/test']" | tr -d '^~ ')"
if [ -z "${PW_VERSION}" ] || [ "${PW_VERSION}" = "undefined" ]; then
  echo "✖ Impossible de lire la version de @playwright/test dans package.json." >&2
  exit 1
fi

IMAGE="mcr.microsoft.com/playwright:v${PW_VERSION}-noble"
PLATFORM="${PW_PLATFORM:-linux/amd64}"

echo "▶ Image      : ${IMAGE}"
echo "▶ Plateforme : ${PLATFORM}"
echo "▶ Répertoire : $(pwd)"
echo "▶ Args PW    : $*"

exec docker run --rm \
  --platform="${PLATFORM}" \
  -e PLAYWRIGHT_HTML_OPEN=never \
  -e YARN_CACHE_FOLDER=/opt/yarn-cache \
  -v "$PWD":/work -w /work \
  -v /work/node_modules \
  -v pw-yarn-cache:/opt/yarn-cache \
  "${IMAGE}" \
  bash -lc '
    set -e
    corepack enable >/dev/null 2>&1 || true
    command -v yarn >/dev/null 2>&1 || npm i -g yarn@1.22.22 >/dev/null 2>&1
    yarn install --frozen-lockfile
    yarn fastest "$@"
  ' _ "$@"
