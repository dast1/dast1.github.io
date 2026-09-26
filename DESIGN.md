---
name: Dastan Aitzhanov — Living Notebook
description: A quiet editorial notebook organized as a precise, browsable field index.
colors:
  paper-light: "#f3efe7"
  ink-light: "#1c1916"
  ink-soft-light: "#3a342e"
  muted-light: "#5c564c"
  line-light: "#ddd4c6"
  accent-light: "#7a3324"
  accent-hover-light: "#5e261b"
  code-light: "#e8e0d4"
  highlight-light: "#efe2d6"
  paper-dark: "#141311"
  ink-dark: "#efeae2"
  ink-soft-dark: "#ddd6cc"
  muted-dark: "#b7aea3"
  line-dark: "#2e2a26"
  accent-dark: "#e7b1a2"
  accent-hover-dark: "#f3d2c8"
  code-dark: "#2a2522"
  highlight-dark: "#3a2c28"
typography:
  display:
    fontFamily: "Newsreader, Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(4.5rem, 12vw, 8.5rem)"
    fontWeight: 400
    lineHeight: 0.78
    letterSpacing: "-0.055em"
  writing-display:
    fontFamily: "Newsreader, Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(4.25rem, 9vw, 6rem)"
    fontWeight: 400
    lineHeight: 0.9
    letterSpacing: "-0.04em"
  headline:
    fontFamily: "Newsreader, Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(2.2rem, 5vw, 3.3rem)"
    fontWeight: 500
    lineHeight: 1.08
    letterSpacing: "-0.028em"
  title:
    fontFamily: "Newsreader, Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif"
    fontSize: "clamp(1.35rem, 2.5vw, 1.72rem)"
    fontWeight: 500
    lineHeight: 1.14
    letterSpacing: "-0.025em"
  reading:
    fontFamily: "Newsreader, Iowan Old Style, Palatino, Palatino Linotype, Georgia, serif"
    fontSize: "1.1875rem"
    fontWeight: 400
    lineHeight: 1.68
  body:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.5
  label:
    fontFamily: "Source Sans 3, Segoe UI, sans-serif"
    fontSize: "0.78rem"
    fontWeight: 600
    lineHeight: 1.2
    letterSpacing: "0.14em"
  mono:
    fontFamily: "ui-monospace, Cascadia Code, SFMono-Regular, Menlo, Consolas, monospace"
    fontSize: "0.7rem"
    fontWeight: 400
    lineHeight: 1.5
rounded:
  square: "0"
  code: "2px"
spacing:
  hairline: "1px"
  xs: "0.35rem"
  sm: "0.55rem"
  md: "0.85rem"
  lg: "1.25rem"
  xl: "2.25rem"
  section: "3.25rem"
components:
  filter-default:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.62rem 0.72rem"
    height: "2.75rem"
  filter-selected:
    backgroundColor: "{colors.ink-light}"
    textColor: "{colors.paper-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.62rem 0.72rem"
    height: "2.75rem"
  text-action:
    backgroundColor: "transparent"
    textColor: "{colors.ink-soft-light}"
    typography: "{typography.body}"
    rounded: "{rounded.square}"
    padding: "0.55rem 0"
    height: "2.75rem"
---

# Design System: Dastan Aitzhanov — Living Notebook

## Overview

**Creative North Star: "The Living Field Notebook"**

The site feels like an editor's working notebook made public: warm paper, strong book typography, restrained indexing marks, and generous breathing room. It is thoughtful and alive, but never promotional. Content relationships are revealed through chronology, labels, dividers, and typography rather than dashboards, cards, illustrations, or ornamental chrome.

The design has two complementary modes. Reading surfaces are quiet and narrow, with Newsreader carrying the argument. Index surfaces widen into precise editorial tables: Source Sans 3 handles tools and metadata while Newsreader keeps every title and summary connected to the writing itself. Writing adds magazine-like changes of scale—one lead argument, ordered threads, and wide explanatory figures—without leaving the notebook's flat, ruled world. Light and dark themes preserve the same warm, low-saturation character.

**Key Characteristics:**

- Warm paper-and-ink themes rather than pure white and black.
- Editorial serif for ideas; humanist sans serif for navigation, controls, and metadata.
- Hairline rules and alignment create structure; surfaces remain flat.
- Square, unembellished controls with visible state changes.
- Chronology and topic threads work together without making the notebook feel like an app dashboard.
- Long-form pages may widen images and diagrams beyond the prose column while keeping text on the reading measure.

## Colors

The palette is a warm, low-chroma paper system with an earthen red accent. Every light-theme role has a deliberate dark-theme counterpart; switch roles as a set rather than mixing tokens across themes.

### Primary

- **Oxblood Annotation:** The accent marks links, kickers, focus, active navigation, and meaningful hover states. Its deeper light-theme hover and pale dark-theme counterpart preserve emphasis without introducing a second accent hue.

### Neutral

- **Warm Paper:** The page canvas and inverse text color for selected filters.
- **Near-Black Ink:** Primary copy, titles, strong dividers, and selected-control fills.
- **Soft Ink:** Summaries, decks, and supporting prose that still belongs to the reading voice.
- **Marginalia Gray:** Dates, counts, placeholders, tags, and secondary navigation.
- **Binding Line:** One-pixel rules, underlines, and unselected-control borders.
- **Code Wash:** Inline and block code backing.
- **Selection Wash:** Text selection, targets, and restrained contextual emphasis.

**The Warm Pairing Rule.** Never substitute stark white, pure black, or a cool gray scale for the paper-and-ink roles.

**The One Accent Rule.** Oxblood is the only chromatic voice. Use it for interaction and editorial emphasis, not for filling large decorative regions.

**The Theme Integrity Rule.** Theme choice is established before the page paints from a saved preference or system preference. Keep browser theme colors aligned with the paper token in each mode.

## Typography

**Display Font:** Newsreader, with Iowan Old Style, Palatino, and Georgia fallbacks  \
**Body Font:** Source Sans 3, with Segoe UI and system sans-serif fallbacks  \
**Label/Mono Font:** Source Sans 3 for labels; the system monospace stack for code and index numbers

**Character:** Newsreader makes the site feel authored, reflective, and bookish; Source Sans 3 keeps navigation and filtering crisp and contemporary. The contrast between the two is structural: serif means ideas and reading, sans serif means wayfinding and operation.

### Hierarchy

- **Display:** Regular-weight, tightly tracked, and dramatically compressed. Ideas use the most extreme display scale; Writing uses a slightly smaller, more open masthead scale so the lead essay can remain the page's strongest title.
- **Headline:** Medium-weight serif for page and long-form titles. Fluid sizing preserves hierarchy across viewports.
- **Title:** Medium-weight serif for indexed idea titles. Compact leading lets multi-line titles remain coherent inside dense rows.
- **Reading:** Regular serif for long-form prose, summaries, and explanatory introductions. Core reading measure is `38.5rem`; supporting notes may extend to roughly `64ch`.
- **Body:** Regular humanist sans serif for the site frame and operational copy.
- **Label:** Semibold, uppercase, and widely tracked for section labels, filter labels, and kickers. This is a small navigational voice, not a general emphasis style.
- **Mono:** Small tabular numerals for ordered idea indices; code uses the same family at context-appropriate sizes.

**The Voice Split Rule.** Use Newsreader for content and Source Sans 3 for interface. Do not set idea titles, summaries, or reading prose in the control font.

**The Quiet Label Rule.** Uppercase labels stay small and sparse. Never scale them into headings or use them for paragraphs.

## Layout

The global shell is centered and capped at `72rem`, with `2.5rem` total viewport inset on larger screens. At `680px` and below, that inset tightens to `1.75rem`. Standard pages receive generous vertical padding, and reading content remains substantially narrower than index content.

Spacing is rhythmic rather than fully tokenized: compact relationships live around `0.35–0.85rem`, row and component padding around `1.15–1.45rem`, and section changes around `2.25–3.25rem`. One-pixel horizontal rules are the primary alignment device.

The Ideas hero uses two asymmetric columns: a smaller title rail and a larger explanatory column. The search-and-filter tool row repeats that `0.8fr / 1.2fr` relationship. At `900px` and below, both become a single column, and each idea's title and summary stack while tags return to the first column.

The Ideas archive is a field index. Every month is a two-column band with an `11.5rem` chronological rail and a flexible record area divided by a vertical rule. Each record begins with a `2.25rem` zero-padded number rail, then a two-column content grid (`0.82fr / 1.18fr`) pairing title with summary; topic links sit beneath the summary. At `680px` and below, month bands become single-column sections, the vertical rule disappears, the month/count header becomes a compact horizontal row, and the number rail narrows to `1.65rem`.

The general entry list shares the archive's editorial grammar: a maximum width of `48rem`, an `11.5rem` date rail, and a flexible title/summary column. It collapses to one column at `680px`, placing the date directly above the entry.

The Home and Work mastheads use a `0.65fr / 1.35fr` editorial split. On Home, the name forms the left rail while a concise thesis and technical background occupy the right. A three-column current-inquiry band follows, separating the label, the governing question, and a quiet account of present work. Selected evidence appears before research themes so the builder claim is substantiated before the reader reaches the essay archive.

The Work archive groups evidence into independent investigations, public technical work, and earlier research. Each section uses a `15rem` explanatory rail and ruled records with year/type metadata, title, summary, and role. Work entries link to a local context page, which in turn links to the original public artifact. Descriptions remain factual and conservative.

The Writing index begins with a `0.72fr / 1.28fr` masthead that pairs the section name with a concise editorial promise. Its featured essay reverses the emphasis into a `1.35fr / 0.65fr` composition: a balanced, maximum-`13ch` title and deck beside date, reading time, current inquiry, and topics. Research threads and the archive then return to ruled index logic. The thread index uses a `15rem` section rail and numbered records that pair a governing question with a starting essay; the archive uses the established `11.5rem` metadata rail. At `900px`, masthead, feature, section headers, and thread framing stack. At `680px`, archive and thread rows become single-column and metadata becomes an inline date/read-time pair.

Long-form article headers remain within `40rem`, and prose stays on the core reading measure. Optional hero media and editorial diagrams may widen to `56rem` while remaining bounded by the viewport inset. This width shift is intentional: it gives visual evidence and systems explanations more room without loosening the measure of the argument itself.

Print is a reading mode, not a screenshot of the interface: navigation chrome, theme controls, pagination, and tag controls disappear; the page becomes black ink on white; and external prose links print their destinations.

**The Rail Alignment Rule.** Dates, months, counts, and zero-padded indices are structural rails. Preserve their shared widths and baselines before adjusting decorative spacing.

**The Reading Measure Rule.** A wide shell does not authorize wide prose. Keep sustained reading on the narrow measure; use the full shell only for relational indexes and navigation.

## Elevation & Depth

The system is intentionally flat. It uses no shadows, gradients, glass effects, or floating panels. Depth comes from tonal contrast, one-pixel rules, typographic scale, and the inverse ink-on-paper treatment of selected filters.

**The Flat-by-Default Rule.** Do not introduce box shadows to cards, filters, search, or navigation. A state should change ink, border, underline, or fill before it changes apparent elevation.

## Shapes

The form language is rectilinear and editorial. Filter buttons, text actions, search fields, and index bands are square. Rules terminate cleanly at content boundaries. The only established rounding is a subtle `2px` radius on code backgrounds, which softens technical material without changing the broader square geometry.

Borders are always thin and purposeful: separators establish chronology, underlines signal links or editable fields, and full outlines define filter choices. Avoid bordered containers when an existing grid line already provides the needed structure.

**The No Card Silhouette Rule.** Ideas are rows in a continuous index, not isolated rounded cards.

## Components

### Navigation

The wordmark is a compact serif signature. Navigation and the theme toggle use muted sans-serif text with generous vertical hit area; hover moves to primary ink. The active route is primary ink with a single inset accent rule at its baseline. Header tools wrap naturally instead of switching to a separate mobile navigation pattern.

### Search Field

The Ideas search is a label, a restrained stroke icon, and a transparent input sitting on a single binding-line underline. Focus changes that underline to the accent color; this `focus-within` state is the field's visible keyboard cue. Placeholder text uses the muted role at full opacity. The field is wide enough for example queries and contains no filled container.

### Filter Buttons

Filters are square outlined controls with a minimum height of `2.75rem`. The label and tabular count form one compact inline group. Hover strengthens the border and text. Selection is explicit through `aria-pressed="true"` and inverts the control to ink fill with paper text; the count remains subordinate through a softened inverse color. Selecting the active non-All filter again returns to All.

### Text Actions

Clear and empty-state actions are transparent, underline-like buttons with the same `2.75rem` minimum height. Hover turns both text and underline to the accent. They should read as editorial actions, not primary calls to action.

### Entry List

Each entry is a ruled two-column row: a muted date rail and a serif content block. Titles are ink at rest and accent on hover. Summaries use soft ink and the reading font; optional eyebrows and tags stay in the sans-serif metadata voice. Topic links use a single subtle bottom rule.

### Writing Masthead

The Writing masthead is quieter than the Ideas display but still unmistakably editorial: a large regular-weight title sits opposite a serif promise, aligned at the baseline and closed by a binding-line rule. It stacks at `900px`; on narrow screens the title uses the mobile display range without forcing the accompanying statement into oversized type.

### Featured Essay

One essay leads through scale rather than a card treatment. Its title is the dominant element, with balanced wrapping, compact leading, and a restrained `13ch` measure; the description remains readable and secondary. A narrow metadata rail holds date, reading time, optional current-thread context, and topics. The lead is the explicitly featured essay when one exists, otherwise the first published essay. Keep it flat, square, and separated from the rest of the page by a strong ink rule.

### Research Thread List

The thread section is a persistent map of four connected inquiries: delegated authority, personal AI, distributed governance, and ownership and incentives. Its introduction occupies a stable rail; ordered rows expose the question and a single recommended starting essay. These are research directions rather than claims of completion. At intermediate widths, keep the number rail visible; on narrow screens the number and content stack cleanly.

### Writing Archive & Topic Navigation

The archive excludes the featured essay and its displayed thread, then lists remaining essays chronologically in ruled rows. Each row pairs date and reading time with title, description, and topics. The section header places topic navigation opposite the archive title: links are quiet text actions, counts use small tabular numerals, and both wrap naturally. Topics support browsing; they are not filled chips or a second filter toolbar.

### Optional Long-form Hero

Use an article hero only when it contributes evidence, atmosphere, or orientation. It is a clean `16:9` image rendered up to `56rem` wide, loaded with high priority, and supplied with meaningful alternative text. Captions are optional, muted, sans-serif, and compact. Do not crop, round, shadow, or decorate the image container.

### Wide Editorial Diagram

An explanatory diagram is a semantic figure that can expand from the prose measure to `56rem`. Frame it with strong top and bottom ink rules; use a two-column heading for the serif proposition and sans-serif explanation, then a ruled process grid. Process steps are an ordered list with small accent labels, serif assertions, and muted supporting copy. A four-step flow uses four columns on wide screens, two at `900px`, and one at `680px`; divider edges must be reassigned at each breakpoint so the grid remains a continuous editorial table. Use accessible heading/caption relationships and preserve source order as the reading order.

### Ideas Field Index

The field index is the signature component. Month headers form the chronological rail; record numbers reinforce ordering without pretending to be publication dates. Idea titles, summaries, and topics occupy stable columns so readers can scan across relationships. Topic links act as in-place filters: activating one updates the selected thread, focuses its corresponding filter, and returns the explorer to view.

Search text and the selected thread combine as an AND filter. Counts update globally and per month, months with no matches disappear, the URL retains non-default `q` and `tag` parameters, and a polite atomic live region announces the visible result count. The clear action appears only when the state differs from the default. Escape resets the explorer and returns focus to search; a zero-result state offers a direct reset.

### Theme Toggle

Theme follows a saved light/dark choice when present and otherwise respects the system preference. Both themes use the same component logic, hierarchy, and interaction language; only semantic color roles change.

### Motion & Accessibility

State transitions are brief and functional: `140ms ease` for filters and `160ms ease` for the search underline. Topic-driven return to the explorer may scroll smoothly, but switches to an immediate jump when reduced motion is requested. Under `prefers-reduced-motion: reduce`, all transitions are disabled and scrolling is automatic.

Keyboard focus generally uses a visible `2px` accent outline with a `3px` offset; the search field uses its accent underline instead. Interactive rows are not simulated controls: search is a native search form, filters and resets are buttons, topic navigation is linked, and selected state is conveyed with `aria-pressed`. A skip link enters the content region, result updates are announced, hidden results use the native hidden state, and topic collections are labeled for assistive technology.

## Do's and Don'ts

### Do:

- **Do** preserve the serif-content/sans-interface distinction on every new surface.
- **Do** use hairline rules, stable rails, and baseline alignment to organize dense information.
- **Do** keep controls keyboard-operable with visible focus and a minimum `2.75rem` interactive height where the incumbent controls establish it.
- **Do** implement light and dark colors as complete semantic sets.
- **Do** retain query state in the URL when adding index filtering behavior.
- **Do** treat month labels, counts, numbers, and tags as supporting metadata rather than competing headlines.
- **Do** let featured Writing titles, optional heroes, and explanatory diagrams widen deliberately while keeping prose narrow.
- **Do** preserve series order and semantic ordered-list structure in thread and process sequences.

### Don't:

- **Don't** turn entries or ideas into rounded, elevated cards.
- **Don't** add a second accent hue, decorative gradients, or cool neutral grays.
- **Don't** widen long-form prose to match the archive index.
- **Don't** hide selected, focus, empty, or zero-result states behind color alone or silent updates.
- **Don't** animate layout changes when reduced motion is requested.
- **Don't** replace the chronology-plus-thread structure with a dashboard, masonry grid, or content-marketing feed.
- **Don't** present the featured essay, thread entries, topic links, or diagrams as rounded cards.
