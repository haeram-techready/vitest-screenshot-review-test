// Reads a Vitest JSON report and finds the toMatchScreenshot failures in it.
//
//   node screenshot-report.mjs stage <report.json> <dir>   copy failure images into <dir>, print the count
//   node screenshot-report.mjs comment <report.json>       print the sticky PR comment (Markdown)
//
// `comment` reads RUN_URL, ARTIFACT_URL and HEAD_SHA from the environment.
// The JSON report has no structured screenshot data, so this parses the matcher's error message.
// It names the outcome, and the line after "Reference screenshot:", "Actual screenshot:" or
// "Diff image:" holds that image's path (@vitest/browser 5.0.3).
import { copyFileSync, existsSync, mkdirSync, readFileSync, realpathSync } from "node:fs";
import { basename, dirname, join, relative } from "node:path";
import { stripVTControlCharacters } from "node:util";

const MARKER = "<!-- vitest-screenshots -->";

const OUTCOMES = [
  ["Screenshot does not match the stored reference.", "changed"],
  ["No existing reference screenshot found", "new"],
  ["Could not capture a stable screenshot", "unstable"],
];
const IMAGE_LABELS = ["Reference screenshot:", "Actual screenshot:", "Diff image:"];

function parseFailure(message) {
  const text = stripVTControlCharacters(message);
  if (!text.includes("toMatchScreenshot")) {
    return null;
  }
  const kind = OUTCOMES.find(([needle]) => text.includes(needle))?.[1] ?? "unstable";
  const lines = text.split("\n");
  const images = {};
  for (const [index, line] of lines.entries()) {
    const label = IMAGE_LABELS.find((l) => line.trim() === l);
    if (label) {
      images[label] = lines[index + 1]?.trim();
    }
  }
  // For a missing reference, "Reference screenshot:" is the new capture in the attachments folder.
  // For a mismatch, it is the stored reference, which the pull request already has.
  const files = kind === "new" ? [images["Reference screenshot:"]] : [images["Actual screenshot:"], images["Diff image:"]];
  return { kind, files: files.filter(Boolean) };
}

function readFailures(reportPath, root = process.env.GITHUB_WORKSPACE ?? process.cwd()) {
  const report = JSON.parse(readFileSync(reportPath, "utf8"));
  const realRoot = realpathSync(root);
  const screenshots = [];
  let otherFailures = 0;
  for (const file of report.testResults) {
    for (const test of file.assertionResults) {
      if (test.status !== "failed") {
        continue;
      }
      const failure = test.failureMessages.map(parseFailure).find(Boolean);
      if (!failure) {
        otherFailures += 1;
        continue;
      }
      const testFile = relative(realRoot, realpathSync(file.name));
      screenshots.push({ testFile, test: test.fullName, ...failure });
    }
  }
  return { screenshots, otherFailures };
}

// Each image lands at <dir>/<test file>/<image name>, the path the comment shows.
function stage(reportPath, dir) {
  const { screenshots } = readFailures(reportPath);
  for (const { testFile, files } of screenshots) {
    for (const file of files) {
      if (existsSync(file)) {
        const target = join(dir, testFile, basename(file));
        mkdirSync(dirname(target), { recursive: true });
        copyFileSync(file, target);
      }
    }
  }
  return screenshots.length;
}

const KIND_TEXT = { changed: "changed", new: "new", unstable: "no stable capture" };

function renderComment({ screenshots, otherFailures }, { runUrl, artifactUrl, headSha }) {
  const commit = headSha ? ` at ${headSha.slice(0, 7)}` : "";
  const run = runUrl ? `[this run](${runUrl})` : "this run";
  if (screenshots.length === 0) {
    return [MARKER, "### Screenshot review", "", `All screenshots match the stored references${commit} (${run}).`, ""].join("\n");
  }
  const rows = screenshots.map(({ testFile, test, kind, files }) => {
    const names = files.map((f) => `\`${basename(f)}\``).join("<br>") || "none";
    return `| \`${testFile}\` | ${test.replaceAll("|", "\\|")} | ${KIND_TEXT[kind]} | ${names} |`;
  });
  const artifact = artifactUrl ? `[screenshot-diffs](${artifactUrl})` : "screenshot-diffs";
  const lines = [
    MARKER,
    "### Screenshot review",
    "",
    `${screenshots.length} screenshot(s) differ from the stored references${commit} (${run}).`,
    "",
    "| Test file | Test | Change | Images |",
    "| --- | --- | --- | --- |",
    ...rows,
    "",
    `The images are in the ${artifact} artifact, one folder per test file.`,
    "",
    "- To approve: a maintainer submits a review (Files changed > Review changes) whose body starts with `/update-screenshots`. A workflow commits the new references to this branch. Running the Update screenshots workflow on this branch does the same.",
    "- To decline: fix the code and push. This check runs again.",
  ];
  if (screenshots.some((s) => s.kind === "unstable")) {
    lines.push("", "A test with no stable capture changed between two captures. Approval does not fix that; make the component render the same each time.");
  }
  if (otherFailures > 0) {
    lines.push("", `${otherFailures} other test(s) failed. See the run log.`);
  }
  lines.push("");
  return lines.join("\n");
}

const [command, reportPath, dir] = process.argv.slice(2);
if (command === "stage" && reportPath && dir) {
  console.log(stage(reportPath, dir));
} else if (command === "comment" && reportPath) {
  const env = process.env;
  process.stdout.write(
    renderComment(readFailures(reportPath), { runUrl: env.RUN_URL, artifactUrl: env.ARTIFACT_URL, headSha: env.HEAD_SHA }),
  );
} else {
  console.error("usage: screenshot-report.mjs stage <report.json> <dir> | comment <report.json>");
  process.exit(2);
}
