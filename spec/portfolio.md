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
  agent instructions, design mockups in `mockups/`) are listed under `exclude` in
  `_config.yml` so they aren't published.
- **No build step and no framework:** the file in the repository is the file that is served.
- **Minimal JS:** the only scripts are the image lightbox and the theme toggle (section 6.2).
  New JS needs a spec change first.
- **Works without JS:** with scripts disabled, all content and links must be usable. The
  lightbox is a progressive enhancement: each project image is wrapped in a link to the full
  image file, so without JS the link opens the image directly. Without JS the theme follows
  the system setting and the theme toggle button stays hidden.

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

The visual direction is **dark neon**, chosen in #2. The reference is the mockup
`mockups/neon.html?hero=3` (repo only, not published). Its visual style is inspired by
<https://portwatch-vi.xyz>: the style only, not its layout or content. Where this section and
the mockup disagree, this section wins. Design changes must still meet sections 2 and 4.

### 6.1 Principles

- A near-black base with a **violet → pink → orange gradient used sparingly**: the name,
  project titles, tag borders, link buttons and small accents. Never on body text.
- Soft shadows, very rounded corners, a frosted-glass top bar, a dark photo hero.
- No web fonts and no monospace text.
- Restrained motion (section 6.8). No scroll-driven animations and no parallax.

### 6.2 Themes

- **Dark** is the primary design. The **light** variant keeps the same layout and accent with
  the light tokens in section 6.3.
- By default the theme follows `prefers-color-scheme`.
- A **theme toggle** button in the top bar switches between dark and light, and the choice is
  saved in `localStorage`. A small script in `<head>` applies the saved theme before the first
  paint (as `data-theme` on `<html>`); a script at the end of `<body>` shows and wires the
  button. The button has the `hidden` attribute in the HTML, so it stays hidden without JS.
  Storage errors are ignored and the page falls back to the system setting.
- The hero panel (section 6.6) stays dark in both themes.

### 6.3 Colour tokens

Defined as CSS custom properties on `:root`. Contrast ratios are measured against the
background named in the last column.

| Token | Dark | Light | Use |
|---|---|---|---|
| `--bg` | `#0b0c12` | `#f6f6fa` | Page background. |
| `--surface` | `#12131c` | `#ffffff` | Cards. |
| `--surface-2` | `#181a26` | `#f3f2f8` | Tag fill, theme toggle. |
| `--ink` | `#eceef3` | `#0d0e14` | Main text. |
| `--ink-2` | `#c9ccd6` | `#2b2d38` | Secondary text: summaries, highlights. |
| `--muted` | `#9297a7` | `#5d6170` | Role labels, link notes, footer. 6.4:1 / 6.2:1 on `--surface`. |
| `--line` | `#262838` | `#e6e6ee` | Hairlines: top bar, image and badge borders. |
| `--card-line` | `#4a4d72` | `#b8b8cf` | Project card and hero border. 2.4:1 / 1.8:1 on `--bg`. |
| `--link` | `#ff7aa8` | `#c4135c` | Text links, bullet markers, focus outline. 7.6:1 / 5.8:1 on `--surface`. |
| `--glass` | `rgba(18, 19, 28, 0.62)` | `rgba(255, 255, 255, 0.7)` | Top bar background. |

Gradients:

- **`--grad`**, the accent. Dark: `#7a5cff` → `#ff2e7e` (55%) → `#ff8a3d`. Light: `#6a4cf0` →
  `#e0136a` (55%) → `#d9530a`. As text it is used for **large text only** (at least 24 px, or
  18.66 px bold), where WCAG needs 3:1; every stop is at least 4.0:1 on its background. The
  hero always uses the dark version.
- **`--grad-btn`**, link buttons: `#9d87ff` → `#ff5c9a` (55%) → `#ffa463` with `#0b0c12` text,
  at least 6.7:1 at every stop. The same in both themes.
- **`--grad-soft`**, tinted backgrounds (year badge, top bar link hover): the `--grad` dark
  stops at 16% opacity (dark) or 12% (light).

Background decoration, fixed behind all content and ignoring pointer events:

- Three large radial "sunset" glows: violet top left, pink top right, orange at the bottom.
  Opacity 30% / 20% / 12% in dark, 18% / 12% / 10% in light.
- Film grain from an inline SVG `feTurbulence` noise (a `data:` URI), opacity 7% in dark and
  3.5% in light.

### 6.4 Typography

- Font stack: `system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif`.
- Body: 1rem, line height 1.6.
- Name (`<h1>`): `clamp(3.2rem, 11vw, 6rem)`, weight 900, line height 1, letter spacing
  -0.045em, gradient text.
- Intro: 1.2rem.
- Project title: 1.75rem (1.5rem below 600 px), weight 800, letter spacing -0.005em, gradient
  text.
- Summary: 1.08rem in `--ink-2`. Role: 0.9rem, the label in `--muted` and the value bold in
  `--ink-2`.
- Small labels (section label, year badge, tags): 0.8rem, bold. The section label is
  uppercase with 0.1em letter spacing.

### 6.5 Layout and spacing

- **Content column:** at most 992 px wide, with 1.5rem side padding (1rem below 600 px).
- **Top bar:** a sticky pill (`border-radius: 999px`) 0.75rem from the top of the viewport, as
  wide as the content column. It holds the handle `ahakkar` with a small glowing gradient dot
  (hidden below 600 px), the profile links and the theme toggle, on one line down to 360 px.
  Frosted glass: `--glass` with `backdrop-filter: blur(16px) saturate(150%)`.
- **Hero panel:** wider than the content column: the viewport width minus 1.5rem (1rem below
  600 px), at most 1440 px. Radius 30px (24px below 600 px), `--card-line` border, background
  `#07070b`, minimum height 520 px. Its text is aligned with the left edge of the content
  column and sits at the top of the panel.
- **Hero text:** the name, the intro and the section label ("Multiple highlight projects
  beginning from 2022") directly under the intro. The text block is exactly as wide as the
  name: the intro and label wrap to the name's width and reflow narrower with it as the
  viewport narrows. Below 600 px they use the full width.
- **Overlap:** the content column starts 12rem above the bottom of the hero (6.5rem below
  600 px), so the first project card overlaps the hero's lower edge.
- **Cards:** stacked with a 1.75rem gap.

### 6.6 Hero image

- The photo is the author's backlit cut-crystal shot, tinted with the accent gradient: a layer
  with `--grad` at 135° and `mix-blend-mode: color` at 90% opacity, which keeps the photo's
  light and shadow and replaces its colours.
- **From 600 px up:** the photo fills the right 64% of the panel at full height
  (`background-size: cover`). Its left edge fades out with a mask (transparent to opaque over
  the first 40% of the photo's width), and the bottom of the panel is darkened (70% black
  fading to none over the lower half) so the section label stays readable.
- **Below 600 px:** the photo sits at the top of the panel, full width and 18rem tall, fading
  out at the bottom. The text follows below it.
- The photo is decorative: a CSS background on an `aria-hidden` element, with no alt text.
  A media query picks the file, so only one is downloaded: `img/hero-1200.jpg` below 600 px,
  `img/hero-2000.jpg` otherwise. It is not lazy-loaded.
- Files:

  | File | Resolution | Max size |
  |---|---|---|
  | `img/hero-2000.jpg` | 2000 × 1333 | 400 KB |
  | `img/hero-1200.jpg` | 1200 × 800 | 150 KB |

  JPEG, sRGB, the full 3:2 frame with the subject centred. Metadata is stripped or limited to
  copyright: no camera or lens serial numbers, no location. The files may be black and white,
  since the tint replaces the colours.

### 6.7 Components

- **Project card:** `--surface` background, 1px `--card-line` border, radius 28px (22px below
  600 px), padding 2.25rem (1.4rem below 600 px), a soft drop shadow. On hover the shadow
  becomes a pink/violet glow; the card does not move.
- **Project images:** the image column floats right at 44% of the card width, with a 2.25rem
  gap to the text. The text flows under the images once they end; highlight bullets use
  `display: list-item flow-root` so their markers don't slide under the images. The first
  image spans the image column and the others sit two per row. Images have radius 18px and a
  1px `--line` border, a `zoom-in` cursor and **no hover effect**. Below 600 px the images
  stack under the text at full width.
- **Title row:** the title in gradient text, followed by the year as a badge: a pill with
  `--grad-soft` background, 1px `--line` border and `--ink` text.
- **Tech tags:** pills (`border-radius: 999px`) with `--surface-2` fill and a 1px gradient
  border (`--grad`), `--ink` text.
- **Highlights:** a bullet list in `--ink-2`, markers in `--link`.
- **Links:** text links use `--link`, underline offset 0.2em, underline 2px thick on hover.
  A project's code, download or demo links are **buttons**: a pill with `--grad-btn`
  background, `#0b0c12` bold text, a pink glow shadow, lifting 1px on hover. A note instead of
  a link ("Closed source, available upon request") is plain `--muted` text.
- **Focus:** a 2px `--link` outline with a 3px offset on links and buttons.
- **Section label:** in the hero, in light text (`rgba(236, 238, 243, 0.85)`) with a soft dark
  text shadow, in both themes. No decoration after it.
- **Footer:** 0.85rem, `--muted`.
- **Lightbox:** backdrop `rgba(11, 12, 18, 0.8)` with an 8px blur; the image has radius 18px
  and a pink glow. Behaviour unchanged.

### 6.8 Motion

- The name's gradient slowly shifts back and forth (10 s, alternating).
- Hover transitions (card glow, button) take at most 0.2 s.
- Under `prefers-reduced-motion: reduce` the name animation, the transitions and the button
  lift are all off.
