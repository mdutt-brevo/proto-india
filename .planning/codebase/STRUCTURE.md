# Codebase Structure

**Analysis Date:** 2026-04-01

## Directory Layout

```
protolabs-india/
├── public/                    # Static assets (images, videos, icons)
├── src/
│   ├── components/
│   │   ├── home/             # Homepage section components
│   │   ├── layout/           # Navbar, Footer (persistent across routes)
│   │   ├── three/            # Three.js/React Three Fiber 3D scenes
│   │   └── ui/               # Reusable UI primitives (Button, Heading, etc.)
│   ├── data/                 # Content & configuration (siteData, videoSources)
│   ├── hooks/                # Custom React hooks (useInView, useDarkMode)
│   ├── pages/                # Route-based page components
│   ├── App.jsx               # Root app component, routing setup
│   ├── main.jsx              # React entry point
│   └── index.css             # Tailwind + global styles
├── dist/                      # Build output (generated)
├── vite.config.js            # Vite build configuration
├── tailwind.config.js        # Tailwind theme & animations
├── eslint.config.js          # ESLint rules
├── postcss.config.js         # PostCSS plugins (autoprefixer)
└── package.json              # Dependencies & scripts
```

## Directory Purposes

**`src/components/`:**
- Purpose: All React components, organized by responsibility
- Contains: Presentational & container components
- Key subdirectories: home/, layout/, three/, ui/

**`src/components/home/`:**
- Purpose: Homepage section components (Hero, services grid, testimonials, etc.)
- Contains: 6 section components (Hero, WhyChooseUs, ServicesSection, IndustriesSection, Testimonials, HomeCTA)
- Key files:
  - `Hero.jsx`: Hero section with lazy 3D scene, gradient overlays
  - `WhyChooseUs.jsx`: 3-card grid with icons, uses SectionScene 3D background
  - `ServicesSection.jsx`: Maps SERVICES data to card grid
  - `IndustriesSection.jsx`: Maps INDUSTRIES data to cards
  - `Testimonials.jsx`: Client testimonials carousel/grid
  - `HomeCTA.jsx`: Call-to-action section

**`src/components/layout/`:**
- Purpose: Persistent page chrome (fixed across routes)
- Contains: Navbar, Footer
- Key files:
  - `Navbar.jsx`: Responsive navbar with mobile menu toggle, dark mode toggle, scroll-triggered background
  - `Footer.jsx`: Footer with company info, navigation links, contact details

**`src/components/three/`:**
- Purpose: Three.js 3D visualizations using React Three Fiber
- Contains: 3D scene components and geometry builders
- Key files:
  - `HeroScene.jsx`: Cinematic orbital camera through 4 manufacturing stations (gears, CNC, flow, mold)
  - `SectionScene.jsx`: Reusable 3D scene variants (mould open/close, CNC sparks, etc.)
  - `IndustrialGear.jsx`: Procedurally-generated 3D gear with teeth, spokes, hub
  - `GearLoader3D.jsx`: Animated interlocking gears for page loading fallback

**`src/components/ui/`:**
- Purpose: Reusable UI primitives
- Contains: Button, headings, loaders, overlays, dividers
- Key files:
  - `Button.jsx`: Polymorphic button (link/anchor/button) with variants (primary, accent, outline)
  - `SectionHeading.jsx`: Centered h2 with subtitle, technical accent lines
  - `DarkModeToggle.jsx`: Moon/sun icon toggle (in Navbar)
  - `GearLoader.jsx`: SVG gear spinner (fallback during 3D load)
  - `BlueprintOverlay.jsx`: Animated blueprint grid pattern overlay
  - `ToolpathDivider.jsx`: Decorative divider (CNC toolpath style)
  - `VideoBackground.jsx`: Video background wrapper with autoplay/loop
  - `SparkBurst.jsx`: Particle effect animation

**`src/pages/`:**
- Purpose: Route-based page components
- Contains: 7 pages corresponding to navigation routes
- Key files:
  - `HomePage.jsx`: Composes home sections (Hero, WhyChooseUs, Services, etc.)
  - `AboutPage.jsx`: Company story, timeline, values
  - `ServicesPage.jsx`: Service cards with icons, features, capabilities
  - `IndustriesPage.jsx`: Industry cards with specializations
  - `GalleryPage.jsx`: Image gallery with category filters
  - `ContactPage.jsx`: Contact form, company info
  - `QuotePage.jsx`: Quote request form

**`src/data/`:**
- Purpose: Content & configuration
- Contains: Site content, video URLs, copy, contact info
- Key files:
  - `siteData.js`: Single source of truth (COMPANY info, NAV_LINKS, SERVICES, INDUSTRIES, TESTIMONIALS, etc.)
  - `videoSources.js`: Pexels CDN video URLs for hero/section backgrounds

**`src/hooks/`:**
- Purpose: Custom React hooks
- Contains: Reusable hook logic
- Key files:
  - `useDarkMode.jsx`: Dark mode context provider + hook (read/write localStorage, toggle <html> dark class)
  - `useInView.js`: Intersection Observer wrapper (returns [ref, isInView] for animation triggers)

**`src/App.jsx`:**
- Purpose: Root app component
- Contains: React Router setup, provider wrappers, route definitions
- Key logic:
  - BrowserRouter wraps everything
  - DarkModeProvider wraps routing
  - AppLayout handles navbar/footer chrome + main content
  - Routes defined with lazy-loaded pages
  - ScrollToTop effect resets scroll on navigation
  - PageLoader Suspense fallback with GearLoader3D/SVG

**`src/main.jsx`:**
- Purpose: React DOM entry point
- Contains: createRoot call
- Renders App component into #root element

**`src/index.css`:**
- Purpose: Global styles, Tailwind setup, theme tokens
- Contains:
  - @tailwind directives (base, components, utilities)
  - @layer base: HTML/body resets, font stack setup
  - @layer components: Button variants (.btn-primary, .btn-outline, etc.)
  - @layer components: Semantic theme tokens (.th-heading, .th-bg-page, .th-border, etc.)
  - Custom animations (@keyframes fadeIn, slideUp, stampIn, gearSpin, etc.)
  - Grid patterns (.blueprint-grid, .blueprint-grid-dark)

## Key File Locations

**Entry Points:**
- `src/main.jsx`: Browser entry point (mounts React)
- `src/App.jsx`: App root, routing logic
- `public/index.html`: HTML template (Vite serves)

**Configuration:**
- `vite.config.js`: Vite dev server + build config
- `tailwind.config.js`: Tailwind theme colors, fonts, animations
- `eslint.config.js`: ESLint rules
- `postcss.config.js`: PostCSS plugins

**Core Logic:**
- `src/components/home/Hero.jsx`: Hero section (hero image + lazy 3D)
- `src/components/three/HeroScene.jsx`: 3D orbital camera animation
- `src/hooks/useDarkMode.jsx`: Dark mode state + localStorage
- `src/data/siteData.js`: All content (SERVICES, INDUSTRIES, TESTIMONIALS, etc.)

**Testing:**
- No test files found in codebase

## Naming Conventions

**Files:**
- Components: `PascalCase.jsx` (e.g., `Hero.jsx`, `Button.jsx`)
- Hooks: `camelCase.js` or `camelCase.jsx` (e.g., `useInView.js`, `useDarkMode.jsx`)
- Data/config: `camelCase.js` (e.g., `siteData.js`, `videoSources.js`)
- Directories: `lowercase` (e.g., `components/`, `hooks/`, `pages/`)

**Directories:**
- Feature-based (e.g., `/home` contains Home page sections)
- Type-based (e.g., `/ui` for reusables, `/three` for 3D)
- Route-based (e.g., `/pages` for page components)

**Functions & Variables:**
- Functions: `camelCase` (e.g., `pageLoader()`, `mapServicesToCards()`)
- React components: `PascalCase` (e.g., `Hero`, `ServicesSection`)
- Constants: `UPPER_SNAKE_CASE` (e.g., `CYCLE`, `ICON_MAP`, `SERVICES`)

**CSS Classes:**
- Tailwind utility classes: `lowercase` with hyphens (e.g., `flex`, `gap-4`, `md:grid-cols-2`)
- Semantic theme tokens: `.th-heading`, `.th-bg-page` (th = theme)
- Button variants: `.btn-primary`, `.btn-outline` (btn = button)
- Animation names: kebab-case (e.g., `animate-fade-in`, `animate-stamp-in`)

## Where to Add New Code

**New Feature/Page:**
1. Create page component: `src/pages/NewPage.jsx`
2. Compose it from sections: Import relevant sections or create new ones
3. Add route in `src/App.jsx`: `<Route path="/newpage" element={<NewPage />} />`
4. Add nav link in `src/data/siteData.js`: Add to NAV_LINKS array
5. If page is reusable section, add to `src/components/home/NewSection.jsx`

**New Section Component:**
- Location: `src/components/home/NewSection.jsx`
- Pattern:
  ```jsx
  import { useInView } from "../../hooks/useInView";
  import SectionHeading from "../ui/SectionHeading";
  
  export default function NewSection() {
    const [ref, isInView] = useInView();
    return (
      <section className="section-padding">
        <SectionHeading title="..." subtitle="..." />
        <div ref={ref} className="...">
          {/* Content with conditional animation classes */}
          <div className={isInView ? "opacity-100" : "opacity-0"}></div>
        </div>
      </section>
    );
  }
  ```
- Add data to `src/data/siteData.js` if needed

**New UI Component:**
- Location: `src/components/ui/NewComponent.jsx`
- Pattern: Presentational, no hooks, reusable across sections
- Example: `SectionHeading.jsx` (accepts title, subtitle, className)

**New 3D Scene:**
- Location: `src/components/three/NewScene.jsx`
- Pattern: React Three Fiber Canvas wrapper
- Import in section component, lazy-load via React.lazy()

**New Hook:**
- Location: `src/hooks/useNewHook.js` or `.jsx`
- Pattern: Custom logic returning tuple or object
- Example: `useInView()` returns [ref, isInView]

**Shared Utilities/Helpers:**
- Location: TBD (not yet created; suggest `src/utils/helpers.js`)
- Examples: Animation utilities, formatters, validators

## Special Directories

**`/public/`:**
- Purpose: Static assets served as-is by Vite
- Contains: favicon, images, videos, SVGs
- Generated: No
- Committed: Yes
- Structure: `/assets/services/`, `/assets/industries/`, `/assets/featured/`, `/assets/gallery/`

**`/dist/`:**
- Purpose: Build output
- Generated: Yes (by `npm run build`)
- Committed: No (.gitignore)
- Contains: Optimized JS/CSS bundles, minified HTML

**`/node_modules/`:**
- Purpose: Installed dependencies
- Generated: Yes (by npm install)
- Committed: No (.gitignore)

**`/.planning/codebase/`:**
- Purpose: Analysis documents (ARCHITECTURE.md, STRUCTURE.md, etc.)
- Generated: By /gsd:map-codebase command
- Committed: Yes

## Component Naming Patterns

**Section Components** (src/components/home/):
- Named after their primary purpose: `Hero`, `WhyChooseUs`, `ServicesSection`
- Pattern: Single default export, receives props (rarely)

**Layout Components** (src/components/layout/):
- `Navbar`, `Footer`
- Pattern: Fixed chrome, use Router hooks (useLocation) for active state

**UI Components** (src/components/ui/):
- Named descriptively: `Button`, `SectionHeading`, `GearLoader`
- Pattern: Reusable, accept className + variant props
- Often polymorphic (Button can be <button>, <Link>, or <a>)

**3D Components** (src/components/three/):
- Named for their scene/object: `HeroScene`, `IndustrialGear`, `SectionScene`
- Pattern: React Three Fiber Canvas wrapper or geometry builder
- Lazy-loaded, wrapped in Suspense

**Custom Hooks** (src/hooks/):
- Named `useX`: `useDarkMode`, `useInView`
- Pattern: Return state/context or tuple [ref, value]

---

*Structure analysis: 2026-04-01*
