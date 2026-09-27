# Translations

These files are the site's human-approved translation memory, one file per
language. `scripts/render-locales.mjs` reads them after every Astro build and
writes localized pages under `dist/<lang>/`. It has no network or AI access and
never modifies these files.

Entries are keyed by a hash of the language and exact English source:

```json
"3f9a…": { "en": "Policy should not be probabilistic.", "t": "La política no debe ser probabilística." }
```

Every entry in this directory is considered approved for publication. Pull
requests and deployments use the same deterministic build. A new or changed
English fragment makes the build fail until a reviewed translation is added;
the live site never silently substitutes English inside a localized page.

To correct a translation, edit its `t` value. When English changes, keep the old
entry for comparison and add the new reviewed entry under its new hash. A future
editorial migration will replace these hashes with stable content identifiers
and explicit review metadata.

Run `npm run locales` (or the backward-compatible `npm run translate`) to build
and validate the localized editions. No API key is used.

Readers land on the language their browser prefers and stay on whichever
language they pick in the header. That choice lives in their browser only.
