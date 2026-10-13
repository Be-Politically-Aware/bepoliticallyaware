import { expect, test } from "bun:test";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  symlinkSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const root = new URL("../", import.meta.url);

function fixture(run: (directory: string) => void) {
  const directory = mkdtempSync(join(tmpdir(), "bpa-content-"));
  try {
    for (const path of ["content", "roadmap", "evidence", "scripts"]) {
      cpSync(new URL(path, root), join(directory, path), { recursive: true });
    }
    cpSync(
      new URL("src/lib/article-schema.ts", root),
      join(directory, "src/lib/article-schema.ts"),
    );
    symlinkSync(
      new URL("node_modules", root).pathname,
      join(directory, "node_modules"),
      "dir",
    );
    run(directory);
  } finally {
    rmSync(directory, { recursive: true, force: true });
  }
}

function run(directory: string, script: string) {
  // The validator should not depend on the caller's working directory.
  return spawnSync(process.execPath, [join(directory, "scripts", script)], {
    cwd: tmpdir(),
    encoding: "utf8",
  });
}

test("content validator accepts the release and rejects broken citations, publication flags and arithmetic", () =>
  fixture((directory) => {
    const valid = run(directory, "validate_content.ts");
    expect(valid.status).toBe(0);
    expect(JSON.parse(valid.stdout).passed).toBe(true);
    const id = "in-start-why-care";
    const path = join(directory, `content/articles/${id}.md`);
    const markdown = readFileSync(path, "utf8")
      .replace("publish: true", "publish: false")
      .replace(/(  url: ")[^"]+/, "$1https://example.org/wrong-source");
    writeFileSync(path, markdown);
    const budgetPath = join(
      directory,
      "content/data/union-budget-2026-27-expenditure.json",
    );
    const budget = JSON.parse(
      readFileSync(budgetPath, "utf8"),
    ) as typeof import("../content/data/union-budget-2026-27-expenditure.json");
    budget.rows[1]!.values[0]! += 1;
    writeFileSync(budgetPath, JSON.stringify(budget));
    const invalid = run(directory, "validate_content.ts");
    expect(invalid.status).toBe(1);
    const report = JSON.parse(invalid.stdout);
    expect(report.passed).toBe(false);
    expect(report.errors).toContain(`${id}: not publishable.`);
    expect(report.errors).toContain(`${id}: citation 1 URL mismatch.`);
    expect(report.errors).toContain("Budget column 0: total mismatch.");
    expect(
      JSON.parse(
        readFileSync(join(directory, "checks/validation.json"), "utf8"),
      ),
    ).toEqual(report);
  }));

test("content validator distinguishes unreadable input from failed checks", () =>
  fixture((directory) => {
    const path = join(directory, "content/articles/in-start-why-care.md");
    writeFileSync(
      path,
      readFileSync(path, "utf8").replace('country: "IN"', 'country: "UK"'),
    );
    const invalid = run(directory, "validate_content.ts");
    expect(invalid.status).toBe(1);
    expect(
      JSON.parse(invalid.stdout).errors.some((error: string) =>
        error.includes("invalid frontmatter"),
      ),
    ).toBe(true);
    writeFileSync(path, "---\ntitle: [unclosed\n---\n");
    const result = run(directory, "validate_content.ts");
    expect(result.status).toBe(2);
    expect(result.stderr).toContain("Validation could not complete:");
  }));
