# Validation — 29 October 2026

Validated in the managed cloud environment with Node 24.19.0, npm 11.9.0, Next.js 16.4.3 and system Chromium.

- `npm ci --no-audit --no-fund`: passed, 128 packages installed from the lockfile.
- `npm run typecheck`: passed.
- `npm run build`: passed, production output generated for 32 pages/routes.
- `npm test`: 3 tests passed, no skipped tests.
- `npx playwright test` against `npm start`: 6 tests passed, no skipped tests. Covers residence navigation, showroom tabs, gallery modal and Escape/keyboard, comparison range, honest unconfigured-form behavior, mobile menu, English/Spanish/Catalan navigation, viewport widths 1440/820/390, unknown residence and admin 404, metadata, API invalid-body/origin rejection and noindex robots.
- Axe WCAG 2 A/AA and 2.1 AA: no violations reported on the English home, Spanish contact and Catalan residence pages. Animation was reduced during this automated audit to avoid testing transient opacity states. This does not replace a full human accessibility audit.
- `npm audit --omit=dev --audit-level=high`: 0 vulnerabilities reported after updating MapLibre to 6.16.0.
- Desktop and mobile screenshots reviewed; no horizontal overflow at tested sizes.

Not validated: real project media (no terrain/render pair, movie, GLB, HDRI, panoramas or plans provided), production map-provider access, Supabase delivery, Resend notifications, CRM, editor roles, legal approval, Core Web Vitals in the field, Vercel deployment or a newly published environment snapshot. These require real assets, account configuration or publication. The 3D/panorama/map adapters compile and are lazy-loaded; the public preview shows explicit pending-asset states rather than fabricated experiences.

No GitHub push or website deployment was performed. Source files are present in the existing checkout and remain uncommitted. Environment `install_script` and `start_skill` were saved as a draft; saving is distinct from publication.
