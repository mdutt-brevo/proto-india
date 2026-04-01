# Architecture

**Analysis Date:** 2026-04-01

## Pattern Overview

**Overall:** Component-driven SPA with layered composition and lazy-loaded routes. Router-based page management at top level, composable sections on each page, with reusable UI components and 3D visualization layers.

**Key Characteristics:**
- **React Router v7** driving page-level navigation with lazy-loaded routes
- **Lazy-loading via React.lazy()** for pages and 3D components to optimize initial paint
- **Context-based state management** (DarkModeProvider) for global theme toggles
- **Three.js/React Three Fiber** for cinematic 3D animations on hero and section backgrounds
- **Intersection Observer hooks** (useInView) triggering entrance animations as sections scroll into view
- **Tailwind CSS** with semantic theme tokens (th-*) for dark mode without duplication

## Layers

**Entry Point & Provider:**
- Purpose: Initialize React app, set up routing context, apply dark mode provider
- Location: `src/main.jsx`, `src/App.jsx`
- Contains: Bootstrap code, route definitions, provider wrappers
- Depends on: React Router DOM, DarkModeProvider
- Used by: React DOM renderer

**Page Layer:**
- Purpose: Route-based view components, act as composition containers
- Location: `src/pages/` (HomePage, AboutPage, ServicesPage, etc.)
- Contains: Page-level layout and section orchestration
- Depends on: Section components, hooks (useInView), data (siteData)
- Used by: React Router Routes

**Section Layer:**
- Purpose: Major content blocks within pages (Hero, WhyChooseUs, Services, etc.)
- Location: `src/components/home/` and scattered across layout
- Contains: Heading + content grid, animations, icon maps
- Depends on: UI components, 3D components (lazy), hooks, siteData
- Used by: Page components

**UI Component Layer:**
- Purpose: Reusable presentational components with consistent styling
- Location: `src/components/ui/`
- Contains: Button, SectionHeading, DarkModeToggle, Dividers, Overlays, Loaders
- Depends on: Tailwind classes, lucide-react icons
- Used by: Sections, layouts

**3D/Three.js Layer:**
- Purpose: Cinematic background animations (gears, molds, CNC machining scenes)
- Location: `src/components/three/`
- Contains: HeroScene, SectionScene, IndustrialGear, GearLoader3D, etc.
- Depends on: Three.js, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- Used by: Hero and section components (lazy-loaded via Suspense)

**Layout Layer:**
- Purpose: Fixed header/footer chrome, persistent across routes
- Location: `src/components/layout/`
- Contains: Navbar (responsive mobile/desktop nav), Footer (company info + links)
- Depends on: UI components, router, siteData
- Used by: App.jsx (wraps all routes)

**State Management:**
- **Dark Mode:** `src/hooks/useDarkMode.jsx` provides DarkModeContext + hook
  - Reads/writes localStorage for persistence
  - Toggles `dark` class on `<html>` for Tailwind's class-based strategy
  - No Redux/Zustand needed for this single global concern

**Custom Hooks:**
- `useInView()` (`src/hooks/useInView.js`): Intersection Observer wrapper
  - Returns [ref, isInView] tuple for lazy animation triggers
  - Fires once on intersection, then disconnects observer

**Data Layer:**
- Purpose: Single source of truth for all site content
- Location: `src/data/siteData.js` (COMPANY, NAV_LINKS, SERVICES, INDUSTRIES, TESTIMONIALS, etc.)
- Location: `src/data/videoSources.js` (Pexels CDN video links)
- Used by: Pages, sections, components for content rendering

## Data Flow

**Page Initialization:**

1. User navigates to route (e.g., `/services`)
2. React Router lazy-loads the page component (ServicesPage)
3. Page renders Suspense wrapper with PageLoader fallback
4. Page composes sections (PageHero, ServiceCard grid, etc.)

**Section Rendering:**

1. Section mounts, applies useInView hook
2. useInView sets up IntersectionObserver, returns [ref, isInView]
3. When element enters viewport (threshold 0.1, rootMargin -60px), isInView becomes true
4. Section renders with conditional animation classes (opacity-100, translate-y-0)
5. Observer disconnects to prevent re-triggering

**3D Component Rendering:**

1. Section lazy-loads 3D component (e.g., HeroScene) wrapped in Suspense
2. Fallback shows null or GearLoader SVG while Three.js bundles load
3. Once loaded, HeroScene mounts Canvas (from @react-three/fiber)
4. Canvas initializes WebGL, renders three stations with orbital camera
5. EffectComposer applies Bloom, ChromaticAberration, Vignette
6. Callback signals completion, parent fades in with opacity transition

**Dark Mode Toggle:**

1. User clicks DarkModeToggle button in Navbar
2. Button calls useDarkMode().toggle()
3. DarkModeProvider state updates, useEffect adds/removes dark class on <html>
4. localStorage updated with "dark" or "light"
5. All th-* utilities and dark: Tailwind selectors respond automatically

**State Management:**
- Minimal: Only dark mode stored in context + localStorage
- Page scroll position reset on route change via ScrollToTop effect in App.jsx
- Form state (Contact, Quote pages) handled locally in component state (no shown yet)

## Key Abstractions

**Icon Mapping (ICON_MAP):**
- Purpose: Decouple data from lucide-react icons, allow safe JSON serialization
- Examples: `src/components/home/Hero.jsx`, `src/components/home/WhyChooseUs.jsx`, `src/pages/ServicesPage.jsx`
- Pattern: Define ICON_MAP object mapping icon names (strings) to imported Icon components, then render dynamically: `ICON_MAP[item.icon]`
- Rationale: siteData.js uses `icon: "ShieldCheck"` (string), not direct imports, preventing circular deps and allowing content-first design

**Semantic Theme Tokens (th-*):**
- Purpose: Bundle dark mode pairs into single class, reducing duplication
- Examples: `th-heading`, `th-bg-page`, `th-border`, `th-input`
- Pattern: Defined in `src/index.css` using @apply to combine light + dark Tailwind selectors
- Usage: Instead of `text-surface-900 dark:text-white`, write `th-heading`
- Rationale: Single source of truth for color strategy; change once, all consumers update

**Lazy-Loaded 3D:**
- Purpose: Defer heavy Three.js bundle until needed, fast initial paint
- Pattern: Wrap 3D components in React.lazy(), render inside Suspense
- Examples: HeroScene in Hero.jsx, SectionScene in WhyChooseUs.jsx
- Fallback: GearLoader SVG or null
- Rationale: 3D adds ~300KB+ to bundle; load only on Hero/key sections

**Composable Sections:**
- Purpose: Each section is self-contained, handles its own data mapping and animations
- Examples: ServicesSection maps SERVICES array to ServiceCard components
- Pattern: Map data array → component with useInView hook + staggered animations
- Rationale: Sections are reusable and testable in isolation

## Entry Points

**main.jsx:**
- Location: `src/main.jsx`
- Triggers: Browser HTML loads, runs createRoot + render
- Responsibilities: Mount React app into #root, apply React.StrictMode

**App.jsx:**
- Location: `src/App.jsx`
- Triggers: main.jsx renders App
- Responsibilities:
  - Wrap BrowserRouter (React Router)
  - Wrap DarkModeProvider (dark mode context)
  - Render AppLayout (Navbar, Routes, Footer)
  - Define all route-to-page mappings (/, /about, /services, etc.)
  - Lazy-load pages via React.lazy()
  - Apply Suspense fallback (PageLoader with GearLoader3D or SVG)
  - Reset scroll position on route change (ScrollToTop effect)

**HomePage.jsx:**
- Location: `src/pages/HomePage.jsx`
- Triggers: User navigates to / or component is lazy-loaded
- Responsibilities: Compose home page sections in order (Hero, WhyChooseUs, Services, Industries, Testimonials, HomeCTA)

## Error Handling

**Strategy:** Defensive, fail-safe approach:
- Missing icons: ICON_MAP accesses undefined, renders nothing (no crash)
- Missing siteData: Array maps render empty lists
- 3D load timeout: Suspense fallback keeps page responsive
- Dark mode on first load: Defaults to system preference, falls back to light

**Patterns:**
- No error boundaries implemented (no shown in codebase)
- Lazy-load fallbacks prevent blank screens (PageLoader with spinning loader + gear icon)
- useInView catches missing DOM refs gracefully (checks `if (!element) return`)

## Cross-Cutting Concerns

**Logging:** None. No console-based logging framework detected. Ad-hoc console.log calls only.

**Validation:** None at component level. Pages assume siteData is well-formed. Contact/Quote forms (if any) use HTML5 input validation only.

**Authentication:** Not applicable. Public marketing site, no user accounts.

**Responsive Design:**
- Tailwind breakpoints: sm, md, lg, xl used throughout
- Sections use grid-based layouts with gap adjustments
- Navbar/Footer toggle mobile menu state
- 3D scenes degrade gracefully on smaller screens (no shown in code, assumed via Three.js)

**Performance Optimization:**
- Code splitting via React.lazy() on pages and 3D components
- Images use loading="lazy" and webp format
- Intersection Observer (useInView) triggers animations only when visible
- Tailwind's JIT compiler tree-shakes unused styles
- Vite dev server with Fast Refresh for instant HMR

**Accessibility:**
- Semantic HTML (header, footer, nav, section, main)
- Alt text on images
- Icon buttons lack aria-label (improvement needed)
- Color contrast: Primary blues + white meet WCAG AA
- Dark mode respects prefers-color-scheme system preference on first load

---

*Architecture analysis: 2026-04-01*
