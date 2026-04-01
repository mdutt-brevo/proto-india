// src/components/animation/InjectionMoldingLoop.jsx
// Phase 2 orchestrator shell — stub scenes only.
// Phase 3-4 will replace SceneStub imports with real scene components one by one.

import { AnimatePresence } from "motion/react";
import { useMoldingLoop } from "../../hooks/useMoldingLoop";
import SceneWrapper from "./SceneWrapper";
import InjectionMoldingStatic from "./InjectionMoldingStatic";
import GranulesScene  from "./scenes/GranulesScene";
import MeltingScene   from "./scenes/MeltingScene";
import InjectionScene from "./scenes/InjectionScene";

// Accessibility: descriptive labels per scene for aria-live region.
// Matches the 7-scene narrative in REQUIREMENTS.md HER-01..HER-07.
const SCENE_LABELS = [
  "Plastic granules feeding into hopper",
  "Granules melting in heated barrel",
  "Screw injecting molten plastic",
  "Mould cavity filling",
  "Part cooling inside mould",
  "Ejector pins releasing part",
  "Finished injection-moulded part",
];

// Stub scenes — Phase 2 placeholder colours, replaced by real SVGs in Phase 3-4.
// Using distinct hues makes it easy to see the loop advancing visually.
const STUB_COLORS = [
  "#64748b", // Scene 1 — slate (raw material)
  "#7c6f3a", // Scene 2 — warm ochre (melting)
  "#ea580c", // Scene 3 — orange (injection)
  "#b45309", // Scene 4 — amber (filling)
  "#1e6b8a", // Scene 5 — teal (cooling)
  "#4a3f7a", // Scene 6 — indigo (ejection)
  "#2d6a4f", // Scene 7 — green (product reveal)
];

// Inline stub — not extracted to a file, intentionally temporary.
// Phase 3 replaces each index with a real scene file import.
function SceneStub({ index }) {
  return (
    <div
      className="w-full h-full flex items-center justify-center"
      style={{ background: STUB_COLORS[index] }}
    >
      <span className="text-white text-lg font-mono opacity-70">
        Scene {index + 1}
      </span>
    </div>
  );
}

export default function InjectionMoldingLoop() {
  const { sceneIndex, shouldReduceMotion } = useMoldingLoop();

  // OS reduced motion: render static fallback, no AnimatePresence tree.
  // shouldReduceMotion=null (SSR unresolved) is treated as false — show animation.
  if (shouldReduceMotion) return <InjectionMoldingStatic />;

  return (
    <div
      className="relative w-full aspect-video overflow-hidden"
      role="img"
      aria-label="Injection moulding process animation"
    >
      {/* aria-live="polite" waits for screen reader silence before announcing.
          aria-atomic="true" reads the full label, not just the changed characters. */}
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {SCENE_LABELS[sceneIndex]}
      </span>

      {/* key={sceneIndex} on SceneWrapper — NOT on AnimatePresence.
          AnimatePresence intercepts the key change and runs exit before mounting
          the next key. Placing key on AnimatePresence itself silently breaks exit. */}
      <AnimatePresence mode="wait">
        <SceneWrapper key={sceneIndex}>
          {sceneIndex === 0 && <GranulesScene />}
          {sceneIndex === 1 && <MeltingScene />}
          {sceneIndex === 2 && <InjectionScene />}
          {sceneIndex >= 3  && <SceneStub index={sceneIndex} />}
        </SceneWrapper>
      </AnimatePresence>
    </div>
  );
}
