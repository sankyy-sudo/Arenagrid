# Sample content

Five published samples each were added to Products, Sports and Projects on 2026-10-28. Existing records were preserved. Names begin with Sample: or Demo: and use dedicated sample-/demo- slugs. All records remain editable/removable in the normal admin panels.

| Theme | Product | Sport | Demo project status |
| --- | --- | --- | --- |
| Football | Synthetic Football Turf | Football & Futsal | Completed |
| Tennis | Acrylic Tennis Court Surface | Tennis | Ongoing |
| Basketball | Outdoor Basketball Court System | Basketball | Completed |
| Indoor | Indoor Wooden Sports Flooring | Indoor Multi-Sport | Ongoing |
| Athletics | Synthetic Running Track Surface | Athletics & Running Tracks | Completed |

Products include descriptions, category, three features, three Best for entries and images. Sports include name, description and image. Projects include title, illustrative location, description, before/after imagery and Ongoing/Completed status. Product-sport and project-product/sport relations are connected. Four published sample categories and ten media-library entries were also created.

The projects are fictional examples, not client work. Before images are labeled site-planning illustrations and After images are existing credited stock photos, not the same sites. Replace these with approved real project content before using them as a portfolio.

## Files and commands

- `prisma/sample-content.json`: original sample copy and image paths.
- `prisma/seed-samples.ts`: dedicated additive importer; never runs the broad demo/user seed.
- `public/images/samples/`: five original before-stage SVG diagrams.
- `package.json`: `db:samples` command.
- `IMAGE_CREDITS.md`: image provenance.

Preview/validate without writing:

```powershell
npm run db:samples
```

Publish missing samples:

```powershell
npm run db:samples -- --apply
```

The importer validates schemas and local image existence before any write, uses a transaction, skips existing slugs/asset URLs and leaves edits to existing samples untouched. It verifies pre-existing product/sport/project scalar records are unchanged before committing. No migration, account creation, schema change or deletion is performed.

## References

[A.S. Sports and Infra](https://assportsandinfra.com/) was reviewed for general facility categories only. [Turf Infra](https://turfinfra.in/) could not be retrieved after two attempts. All sample copy is original; images are reused from the project's existing credited assets.

## Verification

Dry-run validation and TypeScript passed before import. The import reported 5 sports, 5 products, 5 projects, 4 categories and 10 images created, with existing records preserved. Lint and production build passed; the existing Vite bundle-size warning remains.

Live verification passed using the existing API on port 4001 and frontend on 5173: 6 total products (5 samples), 7 sports (5 samples), and 7 projects (5 demos). All 20 sample image placements loaded in the browser. Layout checks passed at 360px and 1280px with no horizontal overflow. A first cold browser request timed out; the repeated complete live check passed.
