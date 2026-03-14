import { useRef, useMemo, useCallback } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Float } from "@react-three/drei";
import {
  EffectComposer, Bloom, ToneMapping,
  ChromaticAberration, Vignette,
} from "@react-three/postprocessing";
import { ToneMappingMode, BlendFunction } from "postprocessing";
import * as THREE from "three";
import IndustrialGear from "./IndustrialGear";

/**
 * HeroScene — Cinematic manufacturing flow animation.
 *
 * A sweeping camera orbits through a dark workshop, passing through
 * four "stations" in a continuous choreographed loop:
 *
 *   Station 1 — GEARS: Interlocking gear assembly (the mechanical heart)
 *   Station 2 — CNC:   Endmill cutting into a workpiece block, sparks fly
 *   Station 3 — FLOW:  Plastic granules streaming into a hopper
 *   Station 4 — MOLD:  Injection mold halves closing and opening
 *
 * The camera smoothly follows a circular path, with depth-of-field
 * and bloom creating the cinematic feel.
 */

// ============================================================
// Timeline constant — one full loop cycle in seconds
// ============================================================
const CYCLE = 40;

// ============================================================
// Utilities
// ============================================================
const METAL = {
  color: "#5a6577",
  metalness: 0.95,
  roughness: 0.32,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1.3,
};

const DARK_METAL = {
  ...METAL,
  color: "#2d3a4a",
  roughness: 0.28,
  clearcoat: 0.5,
};

const POLISHED = {
  ...METAL,
  color: "#7a8694",
  metalness: 0.98,
  roughness: 0.15,
  clearcoat: 0.7,
  clearcoatRoughness: 0.1,
  envMapIntensity: 2.0,
};

function smoothstep(a, b, t) {
  const x = Math.max(0, Math.min(1, (t - a) / (b - a)));
  return x * x * (3 - 2 * x);
}

// ============================================================
// CAMERA RIG — smooth orbiting camera with gentle bob
// ============================================================
function CameraRig() {
  const { camera } = useThree();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    const phase = (t % CYCLE) / CYCLE; // 0 → 1 loop
    const angle = phase * Math.PI * 2;

    // Orbit radius varies — closer pass on gears, wider on mold
    const orbitRadius = 6.5 + Math.sin(angle * 2) * 1.0;
    const height = 0.5 + Math.sin(angle) * 1.2;

    camera.position.x = Math.sin(angle) * orbitRadius;
    camera.position.z = Math.cos(angle) * orbitRadius;
    camera.position.y = height + Math.sin(t * 0.3) * 0.15; // subtle bob

    // Always look slightly ahead of center for cinematic lead
    const lookX = Math.sin(angle + 0.3) * 1.5;
    const lookY = -0.2 + Math.sin(t * 0.2) * 0.1;
    const lookZ = Math.cos(angle + 0.3) * 1.5;
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

// ============================================================
// STATION 1 — GEAR ASSEMBLY (center of the scene)
// ============================================================
function GearStation() {
  return (
    <group position={[0, 0, 0]}>
      {/* Primary — large, centered */}
      <IndustrialGear
        teeth={24}
        radius={2.0}
        depth={0.6}
        speed={0.06}
        color="#4a5568"
        spokes={6}
        position={[0, 0, 0]}
      />

      {/* Secondary — meshes with primary */}
      <IndustrialGear
        teeth={16}
        radius={1.35}
        depth={0.6}
        speed={-0.09}
        color="#2d3f5e"
        spokes={5}
        position={[2.95, 0.65, 0.02]}
      />

      {/* Small fast gear — top */}
      <IndustrialGear
        teeth={10}
        radius={0.7}
        depth={0.45}
        speed={0.22}
        color="#5a6577"
        spokes={4}
        position={[-1.5, 1.6, -0.1]}
      />

      {/* Background depth gear — large, slow, far back */}
      <IndustrialGear
        teeth={28}
        radius={2.8}
        depth={0.35}
        speed={0.025}
        color="#1e2a3a"
        spokes={7}
        position={[0.5, -0.5, -2.5]}
      />
    </group>
  );
}

// ============================================================
// STATION 2 — CNC MACHINING (endmill + workpiece + sparks)
// ============================================================
function CNCStation() {
  const toolRef = useRef();
  const sparksRef = useRef();

  // Spark particle positions
  const sparkCount = 80;
  const { sparkPositions, sparkVelocities, sparkLifetimes } = useMemo(() => {
    const pos = new Float32Array(sparkCount * 3);
    const vel = new Float32Array(sparkCount * 3);
    const life = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      // All start at the contact point
      pos[i * 3] = 0;
      pos[i * 3 + 1] = 0;
      pos[i * 3 + 2] = 0;
      // Random outward velocity
      const a = Math.random() * Math.PI * 2;
      const sp = 0.02 + Math.random() * 0.06;
      vel[i * 3] = Math.cos(a) * sp;
      vel[i * 3 + 1] = Math.abs(Math.sin(a)) * sp + 0.01; // upward bias
      vel[i * 3 + 2] = (Math.random() - 0.5) * sp * 0.5;
      life[i] = Math.random(); // stagger the cycle
    }
    return { sparkPositions: pos, sparkVelocities: vel, sparkLifetimes: life };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    // Endmill spins fast and oscillates along workpiece
    if (toolRef.current) {
      toolRef.current.rotation.y += delta * 12;
      // Slow X oscillation — cutting pass
      toolRef.current.position.x = Math.sin(t * 0.4) * 0.3;
      toolRef.current.position.z = -0.6 + Math.sin(t * 0.25) * 0.05;
    }

    // Spark particles — continuous emission from contact point
    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry.attributes.position;
      for (let i = 0; i < sparkCount; i++) {
        sparkLifetimes[i] += delta * (1.5 + Math.random());
        if (sparkLifetimes[i] > 1) {
          // Reset to contact point
          sparkLifetimes[i] = 0;
          const contactX = toolRef.current ? toolRef.current.position.x : 0;
          posAttr.array[i * 3] = contactX;
          posAttr.array[i * 3 + 1] = -0.3;
          posAttr.array[i * 3 + 2] = -0.6;
          // New random velocity
          const a = Math.random() * Math.PI * 2;
          const sp = 0.02 + Math.random() * 0.06;
          sparkVelocities[i * 3] = Math.cos(a) * sp;
          sparkVelocities[i * 3 + 1] = Math.abs(Math.sin(a)) * sp + 0.015;
          sparkVelocities[i * 3 + 2] = (Math.random() - 0.5) * sp * 0.5;
        }
        // Physics: move + gravity
        posAttr.array[i * 3] += sparkVelocities[i * 3];
        posAttr.array[i * 3 + 1] += sparkVelocities[i * 3 + 1];
        posAttr.array[i * 3 + 2] += sparkVelocities[i * 3 + 2];
        sparkVelocities[i * 3 + 1] -= 0.0008; // gravity
      }
      posAttr.needsUpdate = true;
    }
  });

  return (
    <group position={[5, 0, -3]} rotation={[0, -0.6, 0]}>
      {/* Workpiece block — steel billet being machined */}
      <mesh position={[0, -0.6, 0]}>
        <boxGeometry args={[1.6, 0.6, 1.2]} />
        <meshPhysicalMaterial {...DARK_METAL} />
      </mesh>

      {/* Fixture/vise base */}
      <mesh position={[0, -1.05, 0]}>
        <boxGeometry args={[2.0, 0.3, 1.6]} />
        <meshPhysicalMaterial {...METAL} roughness={0.5} />
      </mesh>

      {/* Endmill — spinning cutting tool */}
      <group ref={toolRef} position={[0, 0.6, -0.6]}>
        {/* Shank (holder) */}
        <mesh position={[0, 0.8, 0]}>
          <cylinderGeometry args={[0.12, 0.12, 1.2, 16]} />
          <meshPhysicalMaterial {...POLISHED} color="#8899aa" />
        </mesh>
        {/* Collet */}
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.15, 0.1, 0.2, 16]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
        {/* Cutting head — fluted endmill */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.08, 0.1, 0.5, 8]} />
          <meshPhysicalMaterial {...POLISHED} color="#b0bec5" clearcoat={0.8} />
        </mesh>
        {/* Tip */}
        <mesh position={[0, -0.42, 0]}>
          <coneGeometry args={[0.08, 0.06, 8]} />
          <meshPhysicalMaterial {...POLISHED} color="#cfd8dc" />
        </mesh>
      </group>

      {/* CNC sparks — from the contact point */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            array={sparkPositions}
            count={sparkCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#ffaa33"
          size={0.05}
          transparent
          opacity={0.95}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Local spot light — bright on the cutting area */}
      <spotLight
        position={[0, 2.5, 1]}
        angle={0.5}
        penumbra={0.8}
        intensity={3}
        color="#ffffff"
        distance={6}
        decay={2}
        target-position={[0, -0.3, -0.6]}
      />
    </group>
  );
}

// ============================================================
// STATION 3 — GRANULE FLOW (hopper funneling plastic pellets)
// ============================================================
function GranuleFlow() {
  const groupRef = useRef();
  const granuleCount = 60;

  const { positions, colors, speeds, phases } = useMemo(() => {
    const pos = [];
    const col = [];
    const spd = [];
    const phs = [];
    const palette = [
      new THREE.Color("#3b82f6"), // blue ABS
      new THREE.Color("#f59e0b"), // amber PP
      new THREE.Color("#10b981"), // green PE
      new THREE.Color("#ef4444"), // red PC
      new THREE.Color("#e2e8f0"), // white nylon
    ];

    for (let i = 0; i < granuleCount; i++) {
      // Start positions — scattered in a funnel shape
      const t = Math.random();
      const funnelWidth = 0.8 * (1 - t) + 0.1;
      const angle = Math.random() * Math.PI * 2;
      pos.push([
        Math.cos(angle) * funnelWidth * Math.random(),
        2.5 - t * 5, // top to bottom
        Math.sin(angle) * funnelWidth * Math.random(),
      ]);
      col.push(palette[Math.floor(Math.random() * palette.length)]);
      spd.push(0.5 + Math.random() * 1.5);
      phs.push(Math.random() * Math.PI * 2);
    }
    return { positions: pos, colors: col, speeds: spd, phases: phs };
  }, []);

  useFrame(({ clock }) => {
    if (!groupRef.current) return;
    const t = clock.getElapsedTime();

    groupRef.current.children.forEach((child, i) => {
      if (!child.isMesh) return;
      // Continuous downward flow, reset at bottom
      child.position.y -= 0.008 * speeds[i];
      if (child.position.y < -3) {
        child.position.y = 2.5 + Math.random();
        const fw = 0.6 * Math.random();
        const a = Math.random() * Math.PI * 2;
        child.position.x = Math.cos(a) * fw;
        child.position.z = Math.sin(a) * fw;
      }
      // Tumble
      child.rotation.x = t * speeds[i] * 0.5 + phases[i];
      child.rotation.z = t * speeds[i] * 0.3;
    });
  });

  return (
    <group position={[-5, 0.5, -2.5]} rotation={[0, 0.8, 0]}>
      {/* Hopper cone */}
      <mesh position={[0, 2.0, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[1.2, 2.0, 16, 1, true]} />
        <meshPhysicalMaterial
          {...METAL}
          color="#3d4a5c"
          side={THREE.DoubleSide}
          transparent
          opacity={0.6}
        />
      </mesh>

      {/* Hopper rim */}
      <mesh position={[0, 3.0, 0]}>
        <torusGeometry args={[1.2, 0.05, 8, 32]} />
        <meshPhysicalMaterial {...POLISHED} color="#6b7a8d" />
      </mesh>

      {/* Nozzle at bottom */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 1.0, 12]} />
        <meshPhysicalMaterial {...POLISHED} color="#6b7a8d" />
      </mesh>

      {/* Flowing granules */}
      <group ref={groupRef}>
        {positions.map((pos, i) => (
          <mesh key={i} position={pos} scale={[0.6 + Math.random() * 0.4, 0.8, 0.6 + Math.random() * 0.4]}>
            <capsuleGeometry args={[0.045, 0.06, 4, 8]} />
            <meshPhysicalMaterial
              color={colors[i]}
              metalness={0.0}
              roughness={0.2}
              transmission={0.5}
              thickness={0.5}
              ior={1.5}
              clearcoat={1.0}
              clearcoatRoughness={0.1}
              transparent
              opacity={0.9}
            />
          </mesh>
        ))}
      </group>

      {/* Warm spot on hopper */}
      <pointLight
        position={[0, 2, 1.5]}
        intensity={1.5}
        color="#f59e0b"
        distance={5}
        decay={2}
      />
    </group>
  );
}

// ============================================================
// STATION 4 — INJECTION MOLD (two halves open/close)
// ============================================================
function InjectionMold() {
  const leftRef = useRef();
  const rightRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    // Slow open/close cycle — 8 seconds per cycle
    const phase = (Math.sin(t * 0.8) + 1) / 2; // 0→1→0
    const gap = phase * 0.8; // max 0.8 units open

    if (leftRef.current) leftRef.current.position.x = -gap;
    if (rightRef.current) rightRef.current.position.x = gap;
  });

  return (
    <group position={[-3, -0.5, 4]} rotation={[0, 2.2, 0]}>
      {/* Left mold half */}
      <group ref={leftRef}>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[1.0, 1.8, 1.4]} />
          <meshPhysicalMaterial {...DARK_METAL} color="#3a4556" />
        </mesh>
        {/* Cavity depression */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.35, 0.35, 0.15, 24]} />
          <meshPhysicalMaterial {...POLISHED} color="#1e293b" />
        </mesh>
        {/* Guide pins */}
        <mesh position={[0, 0.6, 0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
        <mesh position={[0, -0.6, 0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
        <mesh position={[0, 0.6, -0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
        <mesh position={[0, -0.6, -0.4]}>
          <cylinderGeometry args={[0.06, 0.06, 0.4, 8]} />
          <meshPhysicalMaterial {...POLISHED} />
        </mesh>
      </group>

      {/* Right mold half */}
      <group ref={rightRef}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[1.0, 1.8, 1.4]} />
          <meshPhysicalMaterial {...DARK_METAL} color="#3a4556" />
        </mesh>
        {/* Core protrusion */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.12, 24]} />
          <meshPhysicalMaterial {...POLISHED} color="#4a5568" />
        </mesh>
        {/* Guide pin holes */}
        <mesh position={[0, 0.6, 0.4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.6, 0.4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.6} />
        </mesh>
        <mesh position={[0, 0.6, -0.4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.6} />
        </mesh>
        <mesh position={[0, -0.6, -0.4]}>
          <cylinderGeometry args={[0.07, 0.07, 0.3, 8]} />
          <meshPhysicalMaterial color="#0f172a" metalness={0.9} roughness={0.6} />
        </mesh>
      </group>

      {/* Injection nozzle barrel — behind the mold */}
      <mesh position={[2.2, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.2, 0.25, 2.5, 16]} />
        <meshPhysicalMaterial {...METAL} color="#4a5568" />
      </mesh>
      {/* Nozzle tip */}
      <mesh position={[0.9, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.2, 0.3, 16]} />
        <meshPhysicalMaterial {...POLISHED} color="#7a8694" />
      </mesh>

      {/* Hydraulic cylinders */}
      {[-0.5, 0.5].map((z) => (
        <mesh key={z} position={[-2, 0, z]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 2, 12]} />
          <meshPhysicalMaterial {...POLISHED} color="#8899aa" />
        </mesh>
      ))}

      {/* Local lighting — cool blue on the mold */}
      <pointLight
        position={[0, 2, 0]}
        intensity={2}
        color="#60a5fa"
        distance={5}
        decay={2}
      />
    </group>
  );
}

// ============================================================
// AMBIENT EMBERS — drift through the entire scene
// ============================================================
function AmbientEmbers({ count = 60 }) {
  const ref = useRef();

  const { positions, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const spd = new Float32Array(count);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 16;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 10;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 16;
      spd[i] = 0.15 + Math.random() * 0.5;
    }
    return { positions: pos, speeds: spd };
  }, [count]);

  useFrame(({ clock }) => {
    if (!ref.current) return;
    const posAttr = ref.current.geometry.attributes.position;
    const t = clock.getElapsedTime();
    for (let i = 0; i < count; i++) {
      posAttr.array[i * 3 + 1] += speeds[i] * 0.004;
      posAttr.array[i * 3] += Math.sin(t * speeds[i] * 0.5 + i) * 0.002;
      if (posAttr.array[i * 3 + 1] > 6) {
        posAttr.array[i * 3 + 1] = -5;
        posAttr.array[i * 3] = (Math.random() - 0.5) * 16;
        posAttr.array[i * 3 + 2] = (Math.random() - 0.5) * 16;
      }
    }
    posAttr.needsUpdate = true;
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          array={positions}
          count={count}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial
        color="#ff6b1a"
        size={0.04}
        transparent
        opacity={0.85}
        sizeAttenuation
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </points>
  );
}

// ============================================================
// FLOOR — reflective industrial floor plane
// ============================================================
function Floor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}>
      <planeGeometry args={[30, 30]} />
      <meshPhysicalMaterial
        color="#0f1520"
        metalness={0.8}
        roughness={0.6}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}

// ============================================================
// MAIN SCENE EXPORT
// ============================================================
export default function HeroScene({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 7], fov: 42 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          alpha: true,
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.0,
        }}
        style={{ background: "transparent" }}
      >
        {/* ── Cinematic Camera ─────────────────────────────── */}
        <CameraRig />

        {/* ── Global Lighting ──────────────────────────────── */}
        <ambientLight intensity={0.06} color="#94a3b8" />

        {/* Key — cool steel from upper right */}
        <directionalLight position={[6, 5, 4]} intensity={0.8} color="#7d9bc1" />

        {/* Forge rim — warm orange from below-behind */}
        <pointLight
          position={[0, -3, -4]}
          intensity={3.0}
          color="#ff6b1a"
          distance={18}
          decay={2}
        />

        {/* Secondary warm rim — amber edge upper left */}
        <pointLight
          position={[-6, 4, 2]}
          intensity={1.2}
          color="#f59e0b"
          distance={14}
          decay={2}
        />

        {/* Cool fill from front */}
        <directionalLight position={[0, 1, 8]} intensity={0.25} color="#475569" />

        {/* ── Workshop Stations ─────────────────────────────── */}
        <GearStation />
        <CNCStation />
        <GranuleFlow />
        <InjectionMold />
        <AmbientEmbers count={70} />
        <Floor />

        {/* Industrial HDR environment */}
        <Environment preset="warehouse" />

        {/* ── Post-Processing Pipeline ─────────────────────── */}
        <EffectComposer>
          <Bloom
            intensity={0.7}
            luminanceThreshold={0.5}
            luminanceSmoothing={0.4}
            mipmapBlur
          />
          <ChromaticAberration
            blendFunction={BlendFunction.NORMAL}
            offset={new THREE.Vector2(0.0008, 0.0008)}
            radialModulation
            modulationOffset={0.3}
          />
          <Vignette
            darkness={0.5}
            offset={0.3}
          />
          <ToneMapping mode={ToneMappingMode.ACES_FILMIC} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
