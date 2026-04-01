// src/components/animation/SceneWrapper.jsx
// Thin fade envelope for scene transitions.
// AnimatePresence (in InjectionMoldingLoop) is the parent — never nest AnimatePresence here.
// key={sceneIndex} is set by the parent, not this component.

// eslint-disable-next-line no-unused-vars -- m is used as JSX namespace (m.div); ESLint doesn't track JSX member-expression usage
import { m } from "motion/react";
import { SCENE_ENTER, SCENE_EXIT } from "../../lib/motionTokens";

// Single source of truth for cross-fade timing.
// Changing SCENE_ENTER / SCENE_EXIT in motionTokens.js updates all scene transitions.
const FADE = {
  hidden:  { opacity: 0 },
  visible: { opacity: 1, transition: SCENE_ENTER },
  exit:    { opacity: 0, transition: SCENE_EXIT },
};

export default function SceneWrapper({ children }) {
  return (
    <m.div
      className="absolute inset-0"
      variants={FADE}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      {children}
    </m.div>
  );
}
