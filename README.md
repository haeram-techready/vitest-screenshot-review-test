# vitest-screenshot-review-test

A test bed for a screenshot review flow on pull requests. Eight plain DOM components share the CSS variables in `src/theme.css`. Each one has a Vitest browser test that compares the component against a stored `*-chromium-linux.png` reference with `toMatchScreenshot()`.

## Run

```sh
pnpm install
pnpm exec playwright install chromium
pnpm test
```

A local run writes and compares references for its own platform, which git ignores. Set `SKIP_SCREENSHOTS=1` to skip the comparison.

## Review flow

- `.github/workflows/ci.yml` runs the tests on each pull request. With no Linux reference tracked yet, it skips the comparison and shows a notice. Otherwise one sticky comment lists the changed screenshots and links the `screenshot-diffs` artifact.
- To approve the changes, a maintainer submits a review whose body starts with `/update-screenshots`. `.github/workflows/update-screenshots.yml` then commits the new references to the branch.
- The same workflow also runs by hand on a branch: `gh workflow run update-screenshots.yml --ref <branch>`.
- GitHub holds CI for the bot commit. Click **Approve workflows to run** in the merge box.
