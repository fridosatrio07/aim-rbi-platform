# UI Density And Navigation Refactor

## Scope

This refactor keeps the existing platform shell, route structure, and navigation information architecture intact while making the UI denser and more hierarchy-aware.

## Navigation Hierarchy

- `apps/web/src/lib/navigation-data.ts` now exposes centralized helpers for page lookup, parent route lookup, breadcrumbs, module roots, and protected route checks.
- Placeholder pages resolve their parent CTA in this order:
  1. Explicit `parentHref` / `parentLabel` passed to `ModulePlaceholder`.
  2. Parent metadata from `NAVIGATION_ITEMS`.
  3. A derived parent route when it remains inside the protected navigation tree.
  4. `/dashboard` only as the final fallback.
- `/integrity-rbi/revalidation` explicitly links back to `/integrity-rbi`.

## Compact Placeholder Pages

- `PlaceholderModulePage` was converted from a bulky two-card layout into a compact module-state page.
- The placeholder now shows a compact header, breadcrumb, contextual back CTA, planned workspace rows, route chip, status, data source, and readiness bar.
- Placeholder content remains intentionally lightweight for modules that do not yet have detailed mockups.

## Density Layer

- Global shell density was tightened:
  - Desktop topbar height is now 64px.
  - Expanded sidebar is now 248px.
  - Collapsed sidebar is now 64px.
  - Sidebar rows, nested rows, topbar buttons, footer spacing, and card defaults use tighter spacing.
- `src/styles/density.css` provides opt-in compact density hooks for tables and rows.
- `components/data-display/compact-primitives.tsx` adds reusable compact building blocks:
  - `CompactCard`
  - `SectionPanel`
  - `MetricCard`
  - `StatusBadge`
  - `ProgressMiniBar`
  - `BreadcrumbTrail`
  - `PageHeader`
  - `ToolbarButton`

## Dashboard Density

- The Dashboard tools rail no longer permanently reserves right-side grid width.
- Tools open as an overlay and the dashboard starts with the rail collapsed.
- KPI cards use a balanced seven-column desktop strip.
- Critical Attention is placed back into the 12-column analytics grid as a compact panel.

## Frontend Structure Notes

- `src/app` remains route adapters and layout composition.
- Domain-specific data, selectors, and page components remain under `src/features/<domain>`.
- Cross-app route and navigation utilities remain in `src/lib`.
- Shared compact UI primitives are under `src/components/data-display`.
- Empty reserved feature folders are intentionally left in place for future module implementation rather than removed from the project scaffold.
