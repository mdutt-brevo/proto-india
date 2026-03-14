import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import IndustrialGear from "./IndustrialGear";

/**
 * HeroScene — Full-bleed 3D background layer.
 *
 * Inspired by Haidlmair's hero: dark, cinematic, moody.
 * Gears float in deep space with dramatic rim lighting.
 * The entire scene drifts slowly — no user interaction needed.
 * Positioned behind all hero content as an ambient layer.
 *
 * Colors: mechanical grey, dark blue-steel, charcoal.
 * No bright accents — everything is subdued and industrial.
 */

// Slow continuous drift for the whole assembly
function DriftGroup({ children }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();
    // Gentle breathing motion — like a machine idling
    groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.15;
    groupRef.current.rotation.x = 0.3 + Math.sin(t * 0.1) * 0.05;
    groupRef.current.position.y = Math.sin(t * 0.2) * 0.1;
  });

  return <group ref={groupRef}>{children}</group>;
}

function GearAssembly() {
  return (
    <DriftGroup>
      {/* Primary gear — large, centered, dark steel */}
      <Float speed={0.8} rotationIntensity={0.05} floatIntensity={0.15}>
        <IndustrialGear
          teeth={22}
          radius={2.2}
          depth={0.5}
          speed={0.08}
          color="#2d3748"
          position={[0.5, -0.3, 0]}
        />
      </Float>

      {/* Secondary gear — medium, dark blue-grey, meshes with primary */}
      <Float speed={1} rotationIntensity={0.05} floatIntensity={0.1}>
        <IndustrialGear
          teeth={14}
          radius={1.4}
          depth={0.5}
          speed={-0.126}
          color="#1e3a5f"
          position={[3.2, 0.8, 0.05]}
        />
      </Float>

      {/* Tertiary gear — small, background depth piece */}
      <Float speed={1.2} rotationIntensity={0.05} floatIntensity={0.2}>
        <IndustrialGear
          teeth={10}
          radius={0.8}
          depth={0.4}
          speed={0.18}
          color="#374151"
          position={[-1.8, 1.5, -0.5]}
        />
      </Float>

      {/* Fourth gear — far background, very subtle */}
      <Float speed={0.6} rotationIntensity={0.03} floatIntensity={0.1}>
        <IndustrialGear
          teeth={18}
          radius={1.8}
          depth={0.3}
          speed={0.05}
          color="#1a2332"
          position={[-2.5, -1.5, -1.5]}
        />
      </Float>

      {/* Fifth gear — top right, adds depth to composition */}
      <Float speed={0.9} rotationIntensity={0.04} floatIntensity={0.15}>
        <IndustrialGear
          teeth={12}
          radius={1.0}
          depth={0.35}
          speed={-0.1}
          color="#334155"
          position={[2.0, 2.5, -0.8]}
        />
      </Float>
    </DriftGroup>
  );
}

export default function HeroScene({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 50 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* Moody, cinematic lighting — dark workshop at night */}
        <ambientLight intensity={0.15} color="#94a3b8" />

        {/* Key light — cool blue rim from upper right */}
        <directionalLight
          position={[4, 3, 2]}
          intensity={0.6}
          color="#64748b"
        />

        {/* Fill light — subtle blue from left */}
        <directionalLight
          position={[-3, 1, 3]}
          intensity={0.2}
          color="#475569"
        />

        {/* Rim/edge light — faint warm accent for depth separation */}
        <pointLight
          position={[0, -3, 4]}
          intensity={0.3}
          color="#94a3b8"
          distance={10}
          decay={2}
        />

        {/* Subtle backlight for silhouette edge */}
        <pointLight
          position={[-2, 2, -3]}
          intensity={0.15}
          color="#60a5fa"
          distance={12}
          decay={2}
        />

        <GearAssembly />

        {/* Dark studio environment — minimal reflections, just enough
            to make metalness read on the gear surfaces */}
        <Environment preset="night" />
      </Canvas>
    </div>
  );
}
