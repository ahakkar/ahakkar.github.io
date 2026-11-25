# Portfolio specification

This is the specification for the portfolio site of GitHub user `ahakkar`, served at
<https://ahakkar.github.io>. Design and content changes are measured against it. Work that
doesn't match the spec updates the spec first (see `AGENTS.md`).

The key words "must", "should" and "may" are used in their usual requirement sense.

## 1. Purpose and audience

- The site presents a selection of the author's projects, with links to code where available.
- Primary readers are **recruiters** and **technical reviewers** (hiring developers, team leads).
- A reader must be able to scan the project list in **about 30 seconds** and come away knowing,
  for each project: what it is, when it was made, which technologies it uses, and what the
  author's role was. Details beyond that are for readers who choose to dig in.
- The header identifies the author (name, short intro) and links to their profiles
  (GitHub, LinkedIn, Telegram).

## 2. Architecture constraints

- **Single page:** all content is in one `index.html` at the repository root.
- **Inline CSS and JS:** styles in one `<style>` element in `<head>`, scripts in `<script>`
  elements in the same file. No external stylesheets, scripts or web fonts.
- **Images** live in `img/` and are referenced with relative paths.
- **Hosting:** GitHub Pages, published from the `main` branch. Repo-only files (spec, tooling,
  agent instructions) are listed under `exclude` in `_config.yml` so they aren't published.
- **No build step and no framework:** the file in the repository is the file that is served.
- **Minimal JS:** the only script is the image lightbox. New JS needs a spec change first.
- **Works without JS:** with scripts disabled, all content and links must be usable. The
  lightbox is a progressive enhancement: each project image is wrapped in a link to the full
  image file, so without JS the link opens the image directly.

## 3. Content model

### 3.1 Project fields

Each project is one `<section class="project-item">` inside `<main>`, with these fields:

| Field | Required | Notes |
|---|---|---|
| Title | yes | In the card heading. May link to the company or product it was made for. |
| Year | yes | In the card heading. A single year, a range (`2022–2025`), or a start year plus "ongoing" for work that continues. |
| One-line summary | yes | One sentence on what the project is, directly under the heading. |
| Tech tags | yes | Languages, frameworks and tools used, as a list of short tags. |
| Role | yes | The author's role, e.g. "Design and implementation" or "Project manager, documentation". Solo projects state "Solo project". |
| Highlights | no | A short bullet list of notable details. Should stay at most 7 bullets. |
| Links | yes, one of | Links to code, a download or a demo, **or** a note why there is none, e.g. "Closed source, available upon request" or "For internal use only, no code available". |
| Images | yes, with exception | One to three screenshots in `img/`, each with an `alt` that describes what the image shows (not just the project name). Projects without visual output, such as infrastructure work, may have no images. |

### 3.2 Ordering

1. **Pinned projects** come first, in the order the author chooses. The author pins strong
   highlights so they aren't buried under newer but weaker work (currently Workbot, OC2000
   and Advent of Code).
2. The rest follow **newest first** by the most recent year of activity; ongoing projects
   count as the current year. Within the same year the author decides the order.
3. Non-software projects (e.g. home infrastructure) come last.

## 4. Non-functional requirements

- **Valid HTML:** `html-validate` with the `html-validate:recommended` rule set reports no
  errors (section 5).
- **No dead links:** all local links (files and anchors) resolve; external links resolve,
  apart from sites that block automated checkers (section 5).
- **Phone width:** the page works at 360 CSS pixels wide without horizontal scrolling, and
  text stays readable without zooming. Images stack under the text below 600 px.
- **Lazy images:** every project image has `loading="lazy"`, except the images of the first
  project, which are visible on load.
- **Readable contrast:** text meets WCAG 2.2 level AA contrast against its background:
  4.5:1 for normal text, 3:1 for large text (at least 24 px, or 18.66 px bold).
- **Accessible structure:** one `<h1>` for the author, project titles as headings at one
  consistent level, and the page language set on `<html>`.

## 5. Quality checks

| Check | Command | Tool | Locally | CI on every PR and push to `main` |
|---|---|---|---|---|
| HTML validation | `bun run check:html` | `html-validate` (dev dependency, rules in `.htmlvalidate.json`) | before every PR | yes |
| Local links | `bun run check:links` | `lychee --offline` (config in `lychee.toml`) | before every PR | yes |
| All links, incl. external | `bun run check:links:all` | `lychee` | when a PR adds or changes links | no |
| Both local checks | `bun run check` | | convenience | — |

- CI is `.github/workflows/checks.yml`; a failing check blocks the PR.
- **External links are not checked on every PR**, because external sites going down or rate
  limiting would make unrelated PRs fail. They are checked locally when links change, and an
  external site being temporarily down is reported in the PR instead of blocking it.
- There is no scheduled external link check for now; `check:links:all` is run manually.
- Sites that always block automated checkers (currently LinkedIn) are excluded in
  `lychee.toml`. Status 429 (rate limited) counts as success.
- `html-validate` runs through Bun; `lychee` is installed separately (in CI via
  `lycheeverse/lychee-action`).

## 6. Visual design

Placeholder. The visual direction, colour tokens, fonts, spacing and component rules are
decided in #2 and recorded here. Until then the current styling in `index.html` is the
reference, and design changes must still meet sections 2 and 4.
