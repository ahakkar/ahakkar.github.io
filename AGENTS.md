# Agent instructions

Portfolio site for GitHub user `ahakkar`, served by GitHub Pages from `main`.
The specification lives in `spec/` (see issue #1); read it before starting any work.

## Workflow

- Work is issue-based. Every change starts from a GitHub issue; handle issues and PRs with `gh`.
- Specification-driven development: if planned work doesn't match the spec, update the spec first.
  The spec change is its own commit, before the implementation commits in the same PR.
- Work on a branch named `<issue number>-<short-slug>`, branched from an up-to-date `main`.
- PRs are squash-merged to `main`. Reference the issue in the PR (`Closes #N` or `Part of #N`).
- `ahakkar` reviews, approves and merges PRs manually: always request them as reviewer
  (`gh pr create --reviewer ahakkar`). Never merge PRs yourself.
- Never force push. Never run `git clean`.
- New issues use the templates in `.github/ISSUE_TEMPLATE/`.

## Tooling

- Keep the existing tooling unless the user agrees to change it.
- When a new package or tool is needed, propose it to the user with a short reason. Don't add it yourself.
- Tools: Bun (runs `html-validate`, a dev dependency in `package.json`) and `lychee` (link checker,
  installed separately, config in `lychee.toml`). If they aren't on `PATH`, they are in `~/.bun/bin`
  and `~/.cargo/bin`.

## Quality checks

Run before opening a PR; all must pass:

- `bun run check:html` — HTML validation with `html-validate` (rules in `.htmlvalidate.json`).
- `bun run check:links` — lychee, local links only (files and anchors).
- `bun run check:links:all` — lychee including external links. Run it when links change; an
  external site being temporarily down is not a reason to block a PR, report it instead.

CI (`.github/workflows/checks.yml`) runs `check:html` and `check:links` on every PR.

Not applicable to this repo: there is no `/src`, so the 90-character line limit and the test
coverage thresholds don't apply, and the inline JS is too small for type checking or unit tests.

## Communication

- Every question to the user must contain an actual question. If it isn't a question, don't call it one.
