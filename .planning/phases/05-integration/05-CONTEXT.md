# Phase 5: Integration - Context

**Gathered:** 2026-04-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Wire the complete InjectionMoldingLoop into Hero.jsx, convert section scroll animations from CSS to Motion whileInView, ensure App.jsx loader is the CSS/SVG GearLoader, and verify staggered text/CTA reveals still work. This is the final integration — the site ships with the new animation system.

</domain>

<decisions>
## Implementation Decisions

### Claude's Discretion
All implementation choices are at Claude's discretion — integration/wiring phase. Key constraints:

- **Hero.jsx**: Import and render InjectionMoldingLoop as the hero background (replacing where HeroScene was)
- **Section animations**: Convert animate-scale-in, animate-stamp-in, animate-fade-in CSS classes to Motion `whileInView` using `m.div` with appropriate variants
- **App.jsx loader**: Already using CSS/SVG GearLoader (done in Phase 1) — verify it still works
- **CTA reveals**: Existing staggered text animations in Hero.jsx must be preserved or upgraded to Motion variants
- **CTA IDs**: `hero-get-quote-cta` and `hero-view-work-cta` MUST remain intact (QA dependency)
- **Import pattern**: `{ m }` from `motion/react` (LazyMotion is already wrapping the app)

</decisions>

<code_context>
## Existing Code Insights

### Reusable Assets
- `src/components/animation/InjectionMoldingLoop.jsx` — complete 7-scene orchestrator (Phase 2-4)
- `src/hooks/useInView.js` — existing IntersectionObserver hook (may be replaced by Motion whileInView)
- `src/lib/motionTokens.js` — REVEAL, MICRO transition presets for section animations

### Established Patterns
- Hero.jsx currently has staggered CSS animations (animate-fade-in, animate-slide-up, animate-stamp-in)
- Section components use `useInView` + conditional CSS classes for scroll triggers
- Tailwind `animate-*` classes defined in tailwind.config.js

### Integration Points
- `src/components/home/Hero.jsx` — main integration target
- `src/components/home/ServicesSection.jsx` — scroll animation conversion
- `src/components/home/IndustriesSection.jsx` — scroll animation conversion
- `src/components/home/WhyChooseUs.jsx` — scroll animation conversion
- `src/components/home/Testimonials.jsx` — scroll animation conversion (if applicable)

</code_context>

<specifics>
## Specific Ideas

No specific requirements — integration phase

</specifics>

<deferred>
## Deferred Ideas

None

</deferred>
