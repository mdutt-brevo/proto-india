# Coding Conventions

**Analysis Date:** 2026-04-01

## Naming Patterns

**Files:**
- Components: PascalCase with `.jsx` extension (e.g., `Hero.jsx`, `SectionHeading.jsx`, `Button.jsx`)
- Hooks: camelCase with `.js` or `.jsx` extension (e.g., `useInView.js`, `useDarkMode.jsx`)
- Data files: camelCase with `.js` extension (e.g., `siteData.js`, `videoSources.js`)
- Directories: kebab-case for feature grouping (e.g., `components/three/`, `pages/`, `components/home/`)

**Functions:**
- Components: PascalCase (e.g., `Hero()`, `ServicesSection()`, `CameraRig()`)
- Hooks: camelCase with `use` prefix (e.g., `useInView()`, `useDarkMode()`)
- Helper functions within components: camelCase (e.g., `smoothstep()`, `handleChange()`)
- Event handlers: `handle` prefix with action name (e.g., `handleChange()`, `handleSubmit()`, `handleFileChange()`)

**Variables:**
- State variables and references: camelCase (e.g., `sceneReady`, `mobileOpen`, `statsInView`, `formData`)
- Constants: UPPER_SNAKE_CASE (e.g., `STATS`, `COMPANY`, `NAV_LINKS`, `SERVICES`, `CYCLE`)
- DOM references: Ref suffix with camelCase (e.g., `toolRef`, `sparksRef`, `groupRef`, `leftRef`)
- Animation-related: descriptive camelCase (e.g., `sparkPositions`, `sparkVelocities`, `sparkLifetimes`)

**Types:**
- Object shape definitions: camelCase property names (e.g., `{ isDark, toggle }`, `{ isInView, translate-y-0 }`)
- Data structures: PascalCase keys for constants (e.g., `{ name: "", email: "", phone: "" }`)

## Code Style

**Formatting:**
- ESLint with flat config: `eslint.config.js` (ES 2020+ with JSX support)
- No explicit Prettier config—formatting follows ESLint rules
- Double quotes in JSX attributes, single quotes in strings when needed
- Semicolons required (enforced by ESLint)
- Indentation: 2 spaces (standard React convention)

**Linting:**
- ESLint 9.39.4 with `@eslint/js`, `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`
- Recommended rules from `reactHooks.configs.flat.recommended`
- Custom rule: `no-unused-vars` with pattern `^[A-Z_]` to allow component exports and constants
- Target: ES 2020 with JSX parser support

**Tailwind CSS:**
- Utility-first approach with Tailwind v3.4.19
- Custom color palette: `primary` (blue), `accent` (orange), `surface` (grays), `steel` (dark grays)
- Dark mode via `class` strategy—`dark:` prefix for dark mode variants (e.g., `dark:bg-surface-900`, `dark:text-white`)
- Custom font families: `heading` (Plus Jakarta Sans), `body` (DM Sans), `mono` (JetBrains Mono)
- Custom animations for industrial/mechanical effects: `animate-gear-spin`, `animate-stamp-in`, `animate-scale-in`, etc.
- Responsive breakpoints: `sm:`, `md:`, `lg:` prefixes for breakpoint-specific styles

## Import Organization

**Order:**
1. React and hooks (e.g., `import { useState, useEffect }`)
2. Third-party packages (e.g., `lucide-react`, `react-router-dom`)
3. Local components and utilities (e.g., `import Button from "../ui/Button"`)
4. Custom hooks (e.g., `import { useInView }`)
5. Data files (e.g., `import { STATS } from "../../data/siteData"`)

**Path Aliases:**
- None configured—relative imports used throughout (e.g., `../../hooks/useInView`, `../three/HeroScene`)
- Imports consistently use relative paths with directory traversal

## Error Handling

**Patterns:**
- Forms: Client-side validation with HTML5 attributes (`required`, `type="email"`)
- Error feedback: Alert dialogs for form submission (see `ContactPage.jsx`, `QuotePage.jsx`)
- Fallbacks for lazy-loaded components: `<Suspense fallback={...}>` wrapping 3D scenes and pages
- Missing elements: Safe optional chaining (e.g., `e.target.files?.[0]`)
- Context consumption: Error thrown if hook used outside provider (see `useDarkMode()`)

**No Error Boundaries detected** — components rely on Suspense for async errors and form validation for user input errors.

## Logging

**Framework:** `console` (browser native)

**Patterns:**
- No structured logging library observed
- Development: Comments within complex functions explain flow (see `HeroScene.jsx` detailed comments)
- No production logging configured

## Comments

**When to Comment:**
- Complex algorithmic sections: detailed block comments explaining logic flow (e.g., HeroScene camera rig, particle physics)
- Design decisions affecting UI/UX: reasoning for specific styles or animations
- Business logic: context for why a feature exists (e.g., "Reset scroll on route change")
- Three.js scenes: thorough comments explaining stations, materials, and lighting setup

**JSDoc/TSDoc:**
- Minimal JSDoc observed
- Custom hook `useInView` has a block comment explaining its purpose
- Inline comments preferred over formal JSDoc

**Example from codebase (`src/hooks/useInView.js`):**
```javascript
/**
 * Like a `useEffect` that only fires when the element scrolls into view.
 * Think of it as a "lazy useEffect" — same idea as lazy-loading images,
 * but for triggering animations.
 */
export function useInView(options = {}) { ... }
```

## Function Design

**Size:**
- Components range 30–700 lines (HeroScene is an outlier with complex 3D logic)
- Average UI component: 50–160 lines
- Page components: 150–220 lines

**Parameters:**
- Components accept destructured props object
- Functions with 3+ parameters use object destructuring (e.g., `{ onLoaded }` in `LazyGearBackground`)
- Hooks accept options object for configuration (e.g., `useInView(options = {})`)

**Return Values:**
- Components: JSX elements (no TypeScript typing—JSX inferred)
- Hooks: Arrays `[ref, state]` for `useInView`, objects `{ isDark, toggle }` for context consumers
- Event handlers: void (side effects for state updates)

## Module Design

**Exports:**
- Default exports for page components and UI components (e.g., `export default function Button(...)`)
- Named exports for hooks and utilities (e.g., `export function useInView(...)`, `export function DarkModeProvider(...)`)
- Constant exports: Direct export of data (e.g., `export const STATS = [...]`)

**Barrel Files:**
- None used in this codebase—each file exports one component/hook

**Component Composition:**
- Nested components within pages for organization (e.g., `PageHero()`, `ContactInfo()`, `ContactForm()` in `ContactPage.jsx`)
- Higher-level pages compose sections: `HomePage` → `Hero`, `ServicesSection`, `Testimonials`, etc.
- Presentational components (`Button`, `SectionHeading`) separated from layout (`Navbar`, `Footer`)

## Tailwind Utility Examples

**Common patterns:**
- Container: `container-max` (custom class wrapping content)
- Section padding: `section-padding` (custom class for consistent vertical spacing)
- Typography hierarchy: `text-4xl sm:text-5xl lg:text-6xl` for responsive sizing
- Backgrounds: `bg-white dark:bg-surface-900` for theme support
- Transitions: `transition-all duration-300` for smooth state changes
- Dark mode variants: Prefix with `dark:` (e.g., `dark:text-white`, `dark:border-white/10`)

**CTA (Call-to-Action) Elements:**
- All interactive buttons and links include `id` attributes for QA automation
- Pattern: `id="{page}-{action}-cta"` (e.g., `id="hero-get-quote-cta"`, `id="nav-get-quote-cta"`)
- These IDs must be preserved across refactors

---

*Convention analysis: 2026-04-01*
