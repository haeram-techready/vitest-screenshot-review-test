#!/usr/bin/env bash
# Run by ci.yml before the tests. With no Linux reference tracked yet there is nothing to compare
# against, so the run skips screenshots until update-screenshots.yml commits the first set.
# Once one exists, CI=true makes Vitest fail a test whose reference is missing.
set -euo pipefail

if [ -n "$(git ls-files -- ':(glob)**/__screenshots__/**/*-chromium-linux.png')" ]; then
  echo "bootstrap=false" >>"$GITHUB_OUTPUT"
  exit 0
fi
echo "SKIP_SCREENSHOTS=1" >>"$GITHUB_ENV"
echo "bootstrap=true" >>"$GITHUB_OUTPUT"
echo "::notice title=Screenshots not compared::No *-chromium-linux.png reference is tracked yet. Submit a pull request review whose body starts with /update-screenshots to create them."
