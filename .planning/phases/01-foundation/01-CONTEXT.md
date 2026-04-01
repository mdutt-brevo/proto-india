# Phase 1: Foundation - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Remove Three.js entirely from the project (packages + components + imports), apply the dark-only industrial design system (Construction/Architecture palette, Inter + JetBrains Mono fonts), and establish Motion for React as the app-wide animation provider via LazyMotion. The app must build and run cleanly with zero Three.js code remaining.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — pure infrastructure phase. Key constraints from research:
- GearLoader3D in App.jsx (lines 27-43) must be replaced with CSS/SVG loader BEFORE Three.js packages are removed
- SectionScene references in Services, Industries, WhyChooseUs must be removed (no replacement backgrounds)
- LazyMotion with domAnimation features wraps the app at the router level
- motionTokens.js exports shared durations, easings, and spring configs
- Theme toggle and light mode code removed entirely
- Color palette: #64748B primary, #EA580C safety orange accent, dark backgrounds (#0f1923 base)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/ui/GearLoader.jsx` — existing SVG gear loader (CSS-only, no Three.js) — can replace GearLoader3D
- `src/index.css` — industrial design system with metallic-sheen, molten-border, toolpath-divider classes
- `tailwind.config.js` — 14 custom animations already defined
- `src/hooks/useTheme.js` — current theme toggle hook (to be removed)

### Established Patterns
- Lazy loading with React.lazy + Suspense (App.jsx)
- Tailwind CSS utility classes for all styling
- Custom hooks pattern (useInView, useTheme)
- Dark mode via CSS class toggle on document element

### Integration Points
- `src/App.jsx` — GearLoader3D import and Suspense fallback (lines 27-43)
- `src/components/home/Hero.jsx` — HeroScene lazy import (line 7)
- `src/components/home/ServicesSection.jsx` — SectionScene import
- `src/components/home/IndustriesSection.jsx` — SectionScene import
- `src/components/home/WhyChooseUs.jsx` — SectionScene import
- `package.json` — three, @react-three/fiber, @react-three/drei, @react-three/postprocessing deps

</code_context>

<specifics>
## Specific Ideas

No specific requirements — infrastructure phase

</specifics>

<deferred>
## Deferred Ideas

None — infrastructure phase

</deferred>
