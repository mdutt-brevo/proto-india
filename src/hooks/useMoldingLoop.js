import { useState, useEffect } from "react";
import { useReducedMotion } from "motion/react";
import { SCENE_DURATIONS } from "../lib/motionTokens";

// Derive count from the array so this constant stays in sync if the
// SCENE_DURATIONS array is ever extended or shortened in motionTokens.js.
// The reader sees "7 is intentional" without it being magic-numbered here.
const SCENE_COUNT = SCENE_DURATIONS.length;

/**
 * Scene index state machine for the injection-moulding hero animation.
 *
 * Advances sceneIndex from 0 → 1 → … → (SCENE_COUNT - 1) → 0 using
 * per-scene timeouts sourced from SCENE_DURATIONS. Each scene controls
 * its own duration, so the loop self-corrects: change one entry in
 * motionTokens.js and the timing updates everywhere automatically.
 *
 * Reduced-motion path: when the OS reports prefers-reduced-motion,
 * the effect returns immediately without scheduling a timeout. The
 * index freezes at its current value; the consuming component
 * (InjectionMoldingLoop) is expected to render a static fallback.
 *
 * @returns {{ sceneIndex: number, shouldReduceMotion: boolean | null }}
 */
export function useMoldingLoop() {
  const [sceneIndex, setSceneIndex] = useState(0);

  // useReducedMotion subscribes to the OS matchMedia query and re-renders
  // this hook when the user toggles the OS accessibility setting at runtime.
  // Returns true | false | null (null means SSR / unresolved — treat as false
  // so the animation plays until we know for certain it should stop).
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    // Freeze at current index when OS prefers reduced motion.
    // No setTimeout is queued, so no cleanup needed for this branch.
    if (shouldReduceMotion) return;

    // Convert seconds → milliseconds for setTimeout.
    const duration = SCENE_DURATIONS[sceneIndex] * 1000;

    const id = setTimeout(() => {
      // Functional updater avoids a stale-closure on sceneIndex while
      // keeping it in the deps array for the reduced-motion guard above.
      setSceneIndex((i) => (i + 1) % SCENE_COUNT);
    }, duration);

    // Cleanup fires when sceneIndex or shouldReduceMotion changes,
    // cancelling the pending timer before a new one is scheduled.
    // Mirrors observer.disconnect() in useInView.js — always clean up.
    return () => clearTimeout(id);
  }, [sceneIndex, shouldReduceMotion]);

  return { sceneIndex, shouldReduceMotion };
}
