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
- An **author summary** above the projects tells the reader what the author is currently
  focusing on and what kind of work they are open to, before they read the project list.

## 2. Architecture constraints

- **Single page:** all content is in one `index.html` at the repository root.
- **One stylesheet and one script:** styles are in `css/site.css` and scripts in `js/site.js`,
  apart from the small pre-paint theme script (section 6.2), which stays inline in `<head>` so
  the wrong theme never flashes and it adds no render-blocking request. Paths avoid
  `assets/css/style.css`, which the Jekyll theme publishes. No third-party stylesheets,
  scripts or web fonts.
- **Images** live in `img/` and are referenced with relative paths. The avatar (section 6.9)
  is also the favicon.
- **Hosting:** GitHub Pages, published from the `main` branch. Repo-only files (spec, tooling,
  agent instructions, design mockups in `mockups/`) are listed under `exclude` in
  `_config.yml` so they aren't published.
- **No build step and no framework:** the file in the repository is the file that is served.
- **Minimal JS:** the only scripts are the image lightbox (with previous/next navigation
  and swipe gestures) and the theme toggle (section 6.2).
  New JS needs a spec change first.
- **Works without JS:** with scripts disabled, all content and links must be usable. The
  lightbox is a progressive enhancement: each project image is wrapped in a link to the full
  image file, so without JS the link opens the image directly. Without JS the theme follows
  the system setting and the theme toggle button stays hidden.
- **Lightbox behaviour:** clicking a project image opens it in a modal `<dialog>`. When the
  project has more than one image, the lightbox shows previous and next buttons and a counter
  (e.g. `2 / 3`); the buttons and the ← and → keys step through that project's images only,
  wrapping around from the last image to the first and back. Projects with one image show no
  buttons or counter. The buttons and counter are created by JS. On touch screens, a mostly
  horizontal swipe of more than about 50 px also steps through the images (swipe left for
  the next image, right for the previous one), with the same wrap-around and only in
  projects with more than one image. Swipes are ignored while the page is pinch-zoomed, so
  dragging around a zoomed image doesn't change it, and pinch-zoom keeps working in the
  lightbox. Mouse dragging doesn't change images. Clicking a button or swiping doesn't close
  the lightbox; clicking or tapping the image or the backdrop, or pressing Esc, closes it.

## 3. Content model

### 3.1 Author summary

One `<section class="summary-box">` at the top of `<main>`, before the projects. It holds:

- A short label as its heading ("Currently").
- **Focus areas:** at most three, each a bold name followed by a few keywords. They should be
  backed by the projects on the page.
- **Open to:** one line on the kind of work the author is open to, where, and from when
  (for example "Open to internships and junior roles in Pirkanmaa. Available now.").
  It is a plain statement, not a request.

The summary is kept short so that the first project still starts near the top of the page.
It is the author's own wording; agents may draft it, but `ahakkar` approves it.

### 3.2 Project fields

Each project is one `<section class="project-item">` inside `<main>`, after the author summary
and the section label ("Multiple highlight projects beginning from 2022"), with these fields:

| Field | Required | Notes |
|---|---|---|
| Title | yes | In the card heading. May link to the company or product it was made for. |
| Year | yes | In the card heading. A single year, a range (`2022–2025`), or a start year plus "ongoing" for work that continues. |
| One-line summary | yes | One sentence on what the project is, directly under the heading. |
| Tech tags | yes | Languages, frameworks and tools used, as a list of short tags. |
| Role | yes | The author's role, e.g. "Design and implementation" or "Project manager, documentation". Solo projects state "Solo project". |
| Highlights | no | A short bullet list of notable details. Should stay at most 7 bullets. |
| Links | yes, one of | Links to code, a download or a demo, **or** a note why there is none, e.g. "Closed source, available upon request" or "For internal use only, no code available". |
| Images | yes, with exception | One to three screenshots or diagrams in `img/`, each with an `alt` that describes what the image shows (not just the project name). Projects without visual output, such as infrastructure work, may have no images, or a diagram instead (for example of a workflow). |

### 3.3 Ordering

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
  project, which are visible on load on wide screens even below the author summary.
- **Readable contrast:** text meets WCAG 2.2 level AA contrast against its background:
  4.5:1 for normal text, 3:1 for large text (at least 24 px, or 18.66 px bold).
- **Accessible structure:** one `<h1>` for the author, the summary label and the section
  label as `<h2>`s, project titles as `<h3>`s, and the page language set on `<html>`.

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
  saved in `localStorage`. A small inline script in `<head>` applies the saved theme before the
  first paint (as `data-theme` on `<html>`); `js/site.js`, loaded at the end of `<body>`, shows
  and wires the button. The button has the `hidden` attribute in the HTML, so it stays hidden without JS.
  Storage errors are ignored and the page falls back to the system setting.
- The button shows the icon of the theme it switches to and its name (`☀ Light` / `☾ Dark`).
  Below 600 px it shows only the icon, in a circle instead of a pill. Its accessible name is
  always "Switch to light theme" / "Switch to dark theme" (`aria-label`).
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
| `--glass-box` | `rgba(30, 31, 46, 0.62)` | `rgba(255, 255, 255, 0.78)` | Summary box background. `--ink-2` on it stays above 4.5:1 over both the hero photo and the page background. |
| `--glass-line` | `rgba(255, 255, 255, 0.2)` | `rgba(184, 184, 207, 0.7)` | Summary box border. |

Gradients:

- **`--grad`**, the accent. Dark: `#7a5cff` → `#ff2e7e` (55%) → `#ff8a3d`. Light: `#6a4cf0` →
  `#e0136a` (55%) → `#d9530a`. As text it is used for **large text only** (at least 24 px, or
  18.66 px bold), where WCAG needs 3:1; every stop is at least 4.0:1 on its background. The
  hero always uses the dark version.
- **`--grad-btn`**, link buttons: `#9d87ff` → `#ff5c9a` (55%) → `#ffa463` with `#0b0c12` text,
  at least 6.7:1 at every stop. The same in both themes.
- **`--grad-soft`**, tinted backgrounds (year badge, top bar link hover): the `--grad` dark
  stops at 16% opacity (dark) or 12% (light).

Background decoration, fixed behind all content and ignoring pointer events. Each layer is as
tall as the largest viewport (`100lvh`, the height with a phone browser's toolbar hidden), so it
fills the screen while the toolbar hides or reappears:

- Three large radial "sunset" glows: violet top left, pink top right and orange at the bottom.
  Opacity 30% / 20% / 12% in dark, 18% / 12% / 10% in light.
- **On iOS the glows are off.** In iPhone Safari (and the other iOS browsers, which all use
  WebKit) the fixed glow layer shows hard horizontal edges that move while the toolbar hides
  and reappears (issues #27, #29). The glows are hidden with
  `@supports (-webkit-touch-callout: none)`, a property only iOS WebKit supports. It is a proxy
  for detecting iOS, not a real feature check, so it may stop matching in a future iOS. The
  film grain stays on iOS: it has no edges.
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
- Small labels (summary label, section label, year badge, tags): 0.8rem, bold. The summary
  and section labels are uppercase with 0.1em letter spacing.
- Summary box text: 1rem in `--ink-2`, focus area names bold in `--ink`.

### 6.5 Layout and spacing

- **Content column:** at most 992 px wide, with 1.5rem side padding (1rem below 600 px).
- **Top bar:** a sticky pill (`border-radius: 999px`) 0.75rem from the top of the viewport, as
  wide as the content column. It holds the avatar (section 6.9) with the handle `ahakkar`, the
  profile links and the theme toggle, on one line down to 360 px. Below 600 px the handle is
  hidden but the avatar stays, and the theme toggle shows only its icon.
  Frosted glass: `--glass` with `backdrop-filter: blur(16px) saturate(150%)`.
- **Hero panel:** wider than the content column: the viewport width minus 1.5rem, at most
  1440 px. Radius 30px, `--card-line` border, background `#07070b`, minimum height 520 px. Its
  text is aligned with the left edge of the content column and sits at the top of the panel.
  Below 600 px it is a full-width band: the full viewport width, square corners, 1px
  `--card-line` borders at the top and bottom only, and no minimum height.
- **Hero text:** the name and the intro only. The text block is exactly as wide as the
  name: the intro wraps to the name's width and reflows narrower with it as the viewport
  narrows. Below 600 px it uses the full width.
- **Overlap:** the content column starts 8rem above the bottom of the hero (6.5rem below
  600 px), so the summary box overlaps the hero's lower edge.
- **Order in the content column:** the summary box, then the section label 2.5rem below it,
  then the project cards 1.25rem below the label.
- **Cards:** stacked with a 1.75rem gap.

### 6.6 Hero image

- The photo is the author's backlit cut-crystal shot, tinted with the accent gradient: a layer
  with `--grad` at 135° and `mix-blend-mode: color` at 90% opacity, which keeps the photo's
  light and shadow and replaces its colours.
- **From 600 px up:** the photo fills the right 64% of the panel at full height
  (`background-size: cover`). Its left edge fades out with a mask (transparent to opaque over
  the first 40% of the photo's width), and the bottom of the panel is darkened (70% black
  fading to none over the lower half) so the summary box stays readable over the photo.
- **Below 600 px:** the photo sits at the top of the panel, full width and 18rem tall, fading
  out at the bottom. The text follows below it.
- The photo is decorative: a CSS background on an `aria-hidden` element, with no alt text.
  A media query picks the file, so only one is downloaded: `img/hero-1280px.jpg` below 600 px,
  `img/hero-2000px.jpg` otherwise. It is not lazy-loaded.
- Files:

  | File | Resolution | Max size |
  |---|---|---|
  | `img/hero-2000px.jpg` | 2048 × 1365 | 500 KB |
  | `img/hero-1280px.jpg` | 1280 × 853 | 200 KB |

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
- **Summary box:** frosted glass, in the style of the "Executable drop" and "Pinned" boxes on
  <https://portwatch-vi.xyz>: `--glass-box` background, 1px `--glass-line` border,
  `backdrop-filter: blur(18px) saturate(1.3)`, radius 24px (20px below 600 px), padding 1.75rem
  (1.4rem below 600 px) and the shadow `0 20px 60px rgba(10, 6, 30, 0.35)` (a lighter
  `--shadow` in light). It sits partly over the dark hero and partly over the page background
  in both themes. The label is in `--ink-2`, with a small glowing gradient dot in front of
  it. The focus areas are a list without bullets; the "Open to" line sits
  under them, separated by a 1px `--line` hairline.
- **Section label:** on the page background, in `--muted`, followed by a gradient line that
  fills the rest of the row: 1px high, `--grad` at 60% opacity, 1rem from the text.
- **Footer:** 0.85rem, `--muted`.
- **Lightbox:** backdrop `rgba(11, 12, 18, 0.8)` with an 8px blur; the image has radius 18px
  and a pink glow. The lightbox stays dark in both themes. Behaviour is in section 2.
  - **Previous and next buttons:** real `<button>`s with an `aria-label` ("Previous image",
    "Next image"), round (2.75rem), vertically centred over the left and right edges of the
    image. Dark glass: `rgba(11, 12, 18, 0.7)` with an 8px blur, a 1px
    `rgba(236, 238, 243, 0.25)` border and `#eceef3` arrows. On hover the border turns
    `#ff7aa8` with a pink glow. The focus outline is `#ff7aa8` in both themes.
  - **Counter:** a small pill centred at the bottom of the image, in the same dark glass,
    0.8rem bold `#eceef3` text. It is announced to screen readers when it changes.
  - **Below 600 px:** the image is the full width of the viewport, with no corner radius. The
    previous button, the counter and the next button sit in one row centred under the image
    instead of over it, and the image height shrinks so that the image and the row fit on the
    screen together. Projects with one image show no row.

### 6.8 Motion

- The name's gradient slowly shifts back and forth (10 s, alternating).
- Hover transitions (card glow, buttons, lightbox buttons) take at most 0.2 s.
- Switching images in the lightbox is instant, without an animated transition.
- Under `prefers-reduced-motion: reduce` the name animation, the transitions and the button
  lift are all off.

### 6.9 Avatar

The author's avatar is the GitHub profile picture, and the site shows it too. It was chosen in
#40; the concepts compared there are in `mockups/avatar.html`.

- **Design:** a dark disc with a gradient ring and the letters "AH", the same in both themes.
  On a square 512 × 512 canvas:
  - the background is `#0b0c12` with the three sunset glows of the page background (violet
    top left, pink top right, orange at the bottom);
  - a ring centred on the canvas, radius 226 and 16 wide, in the dark `--grad` stops running
    from the top left to the bottom right;
  - the letters "AH" in `#eceef3`.
- **Letters:** drawn as SVG paths in a heavy geometric sans (cap height 158, stems 42), not set
  as text, so the avatar needs no font and looks the same everywhere.
- **Optical centring:** the centre of the letters' ink area, not of their bounding box, is at
  the centre of the canvas. The solid H weighs more than the open top of the A, so the letters
  sit 13 units left of and 5 above the mathematical centre, and the lower left corner of the A
  is closer to the ring than the corners of the H.
- **Round crop:** the ring and the letters are inside the inscribed circle, so GitHub's round
  crop only cuts the dark corners.
- **Small sizes:** the letters stay readable at 20 px, GitHub's smallest avatar size, in both of
  GitHub's themes.
- **Files:**

  | File | Size | Use |
  |---|---|---|
  | `img/avatar.svg` | `viewBox` 512 × 512 | The source; the top bar and the favicon. |
  | `img/avatar-1024px.png` | 1024 × 1024 | Uploaded to GitHub by the author; the page doesn't use it. Under 1 MB, GitHub's limit. |

  The PNG is rendered from the SVG and is rendered again whenever the SVG changes.
- **Top bar:** a 2.25rem circle in front of the handle (section 6.5). It is decorative
  (`alt=""`): it isn't a link, and the handle next to it names the author.
- **Favicon:** `<link rel="icon" href="img/avatar.svg" type="image/svg+xml">` in `<head>`.
