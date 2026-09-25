# astrolay-spike-site

Astro 7 site (TypeScript, strict) with MDX. Run `npm run dev`, `npm run build`, `npm run sync` (regenerates content types).

## Layout

```
src/
  components/     Reusable .astro components (one per file, PascalCase)
  content/        Markdown/MDX collections: services/, posts/
  content.config.ts  Zod schemas for every collection — source of truth for content types
  data/           JSON collections (team.json)
  layouts/        Page shells; Base.astro loads global CSS + main.ts
  lib/            Build-time TypeScript helpers
  pages/          File-based routes
  scripts/        Client-side TypeScript (main.ts runs on every page)
  styles/         global.css; component styles go in scoped <style> blocks
public/           Served as-is (images/, uploads/ for client media)
```

## Rules

- Do not move or rename `src/content/services`, `src/data/team.json`, `public/uploads`, or `astrolay.json`: the editing contract in `astrolay.json` and `.github/scripts/content-check.mjs` depend on those paths.
- When adding a content field, update the schema in `src/content.config.ts`; if clients should edit it, also add it to `fields` in `astrolay.json`.
- Styling: plain CSS with custom properties, no preprocessor. Use the tokens in `src/styles/global.css` (`--color-*`, `--space-*`, `--text-*`, `--radius`) instead of hard-coded values.
