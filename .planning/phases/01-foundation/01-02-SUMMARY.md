---
phase: 01-foundation
plan: 02
subsystem: theme
tags: [dark-mode, tailwind, design-system, fonts, colors]
dependency_graph:
  requires: [01-01]
  provides: [THM-01, THM-02, THM-03, THM-04]
  affects: [all components using th-* tokens, blueprint-grid, metallic-sheen, gradient-mesh]
tech_stack:
  added: []
  patterns:
    - Static class="dark" on html element — no FOUC, no JavaScript theme bootstrap
    - Dark-only th-* semantic tokens — single value, no paired light/dark: variants
key_files:
  created: []
  modified:
    - index.html
    - tailwind.config.js
    - src/index.css
    - src/components/layout/Navbar.jsx
  deleted:
    - src/hooks/useDarkMode.jsx
    - src/components/ui/DarkModeToggle.jsx
decisions:
  - Static dark class preferred over JS-toggle: eliminates FOUC entirely; app is
    dark-only so runtime toggling adds complexity with zero user benefit
  - primary ramp switched from blue (#1a56db) to slate (#64748b) to match industrial
    construction aesthetic; surface ramp already used slate so primary now aligns
  - All :is(.dark) wrappers removed from index.css — with html.dark always present,
    they were permanently active and their conditions were redundant dead weight
metrics:
  duration: "~20 minutes"
  completed_date: "2026-04-01"
  tasks_completed: 2
  files_modified: 4
  files_deleted: 2
---

# Phase 01 Plan 02: Dark-Only Theme + Construction Design System Summary

Static dark class, Inter fonts, slate primary ramp, and dark-only CSS tokens — eliminates
FOUC, dead light-mode CSS, and conditional :is(.dark) blocks throughout index.css.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Enforce static dark class, remove DarkModeToggle | a19b0e0 | index.html, Navbar.jsx, (deleted useDarkMode.jsx + DarkModeToggle.jsx) |
| 2 | Update Tailwind config + index.css design system | 6c83dd5 | tailwind.config.js, src/index.css |

## Changes Made

### index.html

Added `class="dark"` to the `<html>` element. This single attribute ensures
Tailwind's `darkMode: "class"` strategy fires from the first paint with zero
JavaScript involvement — no localStorage read, no flash of light background.

**Before:** `<html lang="en">`
**After:** `<html lang="en" class="dark">`

### Navbar.jsx

Removed `import DarkModeToggle from "../ui/DarkModeToggle"` and both
`<DarkModeToggle />` JSX usages (desktop nav bar and mobile menu). All other
Navbar functionality — scroll detection, mobile drawer, nav links, CTA buttons —
is unchanged.

### Deleted files

- `src/hooks/useDarkMode.jsx` — DarkModeProvider + useDarkMode hook
- `src/components/ui/DarkModeToggle.jsx` — sun/moon toggle button

Both were removed via `git rm`. Confirmed already absent from App.jsx (removed in Plan 01).

### tailwind.config.js

**Primary color ramp (before → after):**

| Token | Before (#blue) | After (#slate) |
|-------|---------------|----------------|
| primary.50 | #eff6ff | #f8fafc |
| primary.100 | #dbeafe | #f1f5f9 |
| primary.200 | #bfdbfe | #e2e8f0 |
| primary.300 | #93c5fd | #cbd5e1 |
| primary.400 | #60a5fa | #94a3b8 |
| primary.500 | #1a56db | **#64748b** |
| primary.600 | #1648c0 | #475569 |
| primary.700 | #1239a3 | #334155 |
| primary.800 | #0e2d87 | #1e293b |
| primary.900 | #0a1f5c | #0f172a |

`accent` and `surface` scales are unchanged.

**Font family (before → after):**

| Key | Before | After |
|-----|--------|-------|
| heading | "Plus Jakarta Sans" | **Inter** |
| body | "DM Sans" | **Inter** |
| mono | "JetBrains Mono" | "JetBrains Mono" (unchanged) |

All 14 animations and keyframes are unchanged.

### src/index.css

**Google Fonts URL:**

Before: `Plus+Jakarta+Sans:wght@400;500;600;700;800 + DM+Sans:wght@400;500;600;700 + JetBrains+Mono:wght@400;500`
After: `Inter:wght@400;500;600;700;800 + JetBrains+Mono:wght@400;500`

**th-* tokens simplified (17 tokens total):**

All collapsed from `light dark:dark` pairs to dark-only values:

| Token | Before | After |
|-------|--------|-------|
| .th-heading | text-surface-900 dark:text-white | text-white |
| .th-body | text-surface-800 dark:text-white | text-white |
| .th-body-secondary | text-surface-800/70 dark:text-white/70 | text-white/70 |
| .th-muted | text-surface-800/60 dark:text-white/60 | text-white/60 |
| .th-subtle | text-surface-800/50 dark:text-white/50 | text-white/50 |
| .th-faint | text-surface-800/40 dark:text-white/40 | text-white/40 |
| .th-ghost | text-surface-800/30 dark:text-white/30 | text-white/30 |
| .th-bg-page | bg-white dark:bg-surface-900 | bg-surface-900 |
| .th-bg-alt | bg-surface-50 dark:bg-surface-900/80 | bg-surface-900/80 |
| .th-bg-card | bg-white dark:bg-surface-800 | bg-surface-800 |
| .th-bg-inset | bg-surface-50 dark:bg-surface-800/50 | bg-surface-800/50 |
| .th-bg-primary-soft | bg-primary-50 dark:bg-primary-900/30 | bg-primary-900/30 |
| .th-border | border-surface-100 dark:border-white/10 | border-white/10 |
| .th-border-input | border-surface-200 dark:border-white/15 | border-white/15 |
| .th-border-subtle | border-surface-200/60 dark:border-white/[0.08] | border-white/[0.08] |
| .th-border-section | border-surface-200/60 dark:border-white/10 | border-white/10 |
| .th-input / .th-select | paired light+dark: values | dark values only |

**Other CSS blocks simplified:**

- `.gradient-mesh` — removed light-mode block; dark block made unconditional;
  blue `rgba(0,102,204,*)` updated to slate `rgba(100,116,139,*)` at same opacity
- `.blueprint-grid` — major lines `rgba(26,86,219,0.06)` → `rgba(100,116,139,0.08)`;
  minor lines `rgba(26,86,219,0.03)` → `rgba(100,116,139,0.04)`
- `.metallic-sheen` — removed dark light-mode block; dark gradient made unconditional
- `.metallic-surface` — removed light-mode block; dark block made unconditional
- `.dimension-line::before/::after` — removed light blue `rgba(26,86,219,0.3)`;
  dark `rgba(96,165,250,0.3)` made unconditional
- `.crosshair::before/::after` — same pattern as dimension-line
- `body` base — simplified to `text-white/90 bg-surface-900`; theme transition removed
- Scrollbar — simplified to dark-only values

**Final `:is(.dark)` count in index.css: 0**

## Verification Results

| Check | Result |
|-------|--------|
| `grep 'class="dark"' index.html` | PASS — matched on `<html>` tag |
| `grep -r "DarkModeToggle\|useDarkMode" src/` | PASS — no output (CLEAN) |
| `grep "Inter" tailwind.config.js` | PASS — heading + body entries |
| `grep "Plus Jakarta\|DM Sans" tailwind.config.js` | PASS — no output (removed) |
| `grep "1a56db" tailwind.config.js` | PASS — no output (removed) |
| `grep "64748b" tailwind.config.js` | PASS — primary.500 entry matched |
| `grep -c ":is(.dark)" src/index.css` | PASS — returns 0 |
| `grep "26, 86, 219" src/index.css` | PASS — no output (removed) |
| `npm run build` | PASS — built in 345ms, 0 errors |

## Deviations from Plan

### Auto-fixed Issues

**1. [Rule 2 - Missing] Scrollbar dark: conditionals simplified**
- **Found during:** Task 2
- **Issue:** Scrollbar rules at end of index.css had `dark:` variants that were
  not listed in the plan but follow the same simplification pattern
- **Fix:** Collapsed `bg-surface-100 dark:bg-surface-900` → `bg-surface-900` and
  `bg-surface-200 dark:bg-white/10` → `bg-white/10` to keep zero dark: conditionals
- **Files modified:** src/index.css

### Files Already Handled by Prior Plan

- `src/hooks/useDarkMode.jsx` and `src/components/ui/DarkModeToggle.jsx` were
  already deleted in commit `49493ca` (Plan 01-03 executed before this plan).
  The `git rm` calls in Task 1 confirmed files were already absent — no action needed.
- `DarkModeProvider` was already removed from `src/App.jsx` in Plan 01.

## Self-Check: PASSED

All files confirmed present/absent as expected. Both task commits verified in git history.
