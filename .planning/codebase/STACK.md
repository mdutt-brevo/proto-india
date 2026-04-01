# Technology Stack

**Analysis Date:** 2026-04-01

## Languages

**Primary:**
- JavaScript (JSX) - React component markup and logic
- CSS (Tailwind CSS) - Styling and responsive design

## Runtime

**Environment:**
- Node.js (via npm)

**Package Manager:**
- npm (v10+)
- Lockfile: `package-lock.json` (present)

## Frameworks

**Core:**
- React 19.2.4 - UI library with hooks and lazy loading
- React Router DOM 7.13.1 - Client-side routing and navigation

**3D Graphics:**
- Three.js 0.183.2 - 3D rendering engine for WebGL scenes
- @react-three/fiber 9.5.0 - React renderer for Three.js
- @react-three/drei 10.7.7 - Utility components (Environment, Float, etc.)
- @react-three/postprocessing 3.0.4 - Post-processing effects (Bloom, ToneMapping, ChromaticAberration, Vignette)
- postprocessing (peer dependency) - Low-level post-processing library

**Animation:**
- motion (framer-motion v12.38.0) - Declarative animation library for React

**UI & Icons:**
- lucide-react 0.577.0 - Icon library (Phone, Mail, MapPin, Clock, Upload, etc.)
- Tailwind CSS 3.4.19 - Utility-first CSS framework

**Build/Dev:**
- Vite 8.0.0 - Frontend build tool and dev server
- @vitejs/plugin-react 6.0.0 - React integration for Vite
- PostCSS 8.5.8 - CSS transformation tool
- Autoprefixer 10.4.27 - Vendor prefix automation

**Linting:**
- ESLint 9.39.4 - JavaScript linter
- @eslint/js 9.39.4 - ESLint recommended config
- eslint-plugin-react-hooks 7.0.1 - React Hooks linting rules
- eslint-plugin-react-refresh 0.5.2 - React Refresh compatibility

**Type Support:**
- @types/react 19.2.14 - TypeScript types for React
- @types/react-dom 19.2.3 - TypeScript types for React DOM
- globals 17.4.0 - Global variables for ESLint

## Key Dependencies

**Critical:**
- react@19.2.4 - Core UI framework, enables Suspense and lazy loading
- three@0.183.2 - Handles all 3D geometry, materials, lighting, and WebGL rendering
- @react-three/fiber@9.5.0 - Bridges React component model to Three.js scene graph
- @react-three/postprocessing@3.0.4 - Enables advanced visual effects (bloom, tone mapping)
- react-router-dom@7.13.1 - Multi-page SPA with 7 routes and code splitting

**Infrastructure:**
- vite@8.0.0 - Fast dev server, optimized builds with chunking
- tailwindcss@3.4.19 - Custom color palette (primary, accent, surface, steel), animations (gear-spin, shimmer, molten-flow, spark)
- lucide-react@0.577.0 - Icon system for UI elements

## Configuration

**Environment:**
- No `.env` file present — all configuration is hardcoded in source files
- No secrets required for runtime
- Company data centralized in `src/data/siteData.js`

**Build:**
- Vite config: `vite.config.js` (minimal, sets chunkSizeWarningLimit to 1000)
- PostCSS config: `postcss.config.js` (Tailwind + Autoprefixer)
- Tailwind config: `tailwind.config.js` (extends with custom colors, animations, font families)
- ESLint config: `eslint.config.js` (flat config, ecmaVersion 2020)

## Platform Requirements

**Development:**
- Node.js (npm packages installed in `node_modules/`)
- Browser with WebGL 2.0 support for Three.js
- Recommended: modern browser (Chrome 90+, Firefox 88+, Safari 15+)

**Production:**
- Static hosting (Vite builds to `dist/`)
- No server-side rendering required
- CDN-friendly: external video assets from Pexels
- Google Fonts via `@import` in `src/index.css` (Plus Jakarta Sans, DM Sans, JetBrains Mono)

## Notable Decisions

**No TypeScript:** Project uses JSX/JavaScript without TypeScript compilation (no `tsconfig.json` in use).

**Custom Animations:** Extensive Tailwind keyframes for industrial theming (gearSpin, stampIn, shimmer, drawLine, moltenFlow, spark, pulseGlow, wipeRight, scaleIn).

**Font Stack:** Three Google Fonts (Plus Jakarta Sans for headings, DM Sans for body, JetBrains Mono for mono).

**Video Assets:** External Pexels CDN links (no local video files committed) — can be swapped to `public/assets/videos/` locally.

---

*Stack analysis: 2026-04-01*
