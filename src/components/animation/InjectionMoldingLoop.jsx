// src/components/animation/InjectionMoldingLoop.jsx
// Phase 4: all 7 scene components wired. SceneStub removed.

import { AnimatePresence } from "motion/react";
import { useMoldingLoop } from "../../hooks/useMoldingLoop";
import SceneWrapper from "./SceneWrapper";
import InjectionMoldingStatic from "./InjectionMoldingStatic";
import GranulesScene  from "./scenes/GranulesScene";
import MeltingScene   from "./scenes/MeltingScene";
import InjectionScene      from "./scenes/InjectionScene";
import FillingScene        from "./scenes/FillingScene";
import CoolingScene        from "./scenes/CoolingScene";
import EjectionScene       from "./scenes/EjectionScene";
import ProductRevealScene  from "./scenes/ProductRevealScene";

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
          {sceneIndex === 3 && <FillingScene />}
          {sceneIndex === 4 && <CoolingScene />}
          {sceneIndex === 5 && <EjectionScene />}
          {sceneIndex === 6 && <ProductRevealScene />}
        </SceneWrapper>
      </AnimatePresence>
    </div>
  );
}
