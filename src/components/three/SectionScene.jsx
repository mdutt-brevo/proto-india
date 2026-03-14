import { useRef, useMemo, useState, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import * as THREE from "three";

/**
 * SectionScene — Lightweight 3D backgrounds for home page sections.
 *
 * Each variant renders a different manufacturing vignette:
 *   "mould"     → Plastic mould halves open/close, colored part emerges
 *   "forge"     → Steel gear turning slowly with CNC sparks
 *   "injection" → Granule stream flowing into barrel + mold
 *
 * Only mounts the Canvas when the section is in viewport to avoid
 * wasting GPU resources on off-screen scenes.
 */

// ── Shared PBR presets ────────────────────────────────────────────
const STEEL = {
  metalness: 0.95,
  roughness: 0.32,
  clearcoat: 0.3,
  clearcoatRoughness: 0.4,
  envMapIntensity: 1.2,
};

const POLISHED = {
  metalness: 0.98,
  roughness: 0.18,
  clearcoat: 0.6,
  clearcoatRoughness: 0.15,
  envMapIntensity: 1.8,
};

// ============================================================
// VARIANT: MOULD — Plastic mould open/close cycle
// ============================================================
function MouldVariant() {
  const leftRef = useRef();
  const rightRef = useRef();
  const partRef = useRef();
  const groupRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Slow idle rotation of the whole group
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.2 + 0.3;
      groupRef.current.rotation.x = Math.sin(t * 0.1) * 0.05;
    }

    // Mould open/close — 6s cycle
    const cycle = (Math.sin(t * 1.0) + 1) / 2;
    const gap = cycle * 0.6;

    if (leftRef.current) leftRef.current.position.x = -0.5 - gap;
    if (rightRef.current) rightRef.current.position.x = 0.5 + gap;

    // Part rises when mold opens, retracts when closing
    if (partRef.current) {
      partRef.current.position.y = cycle * 0.4 - 0.1;
      partRef.current.material.opacity = 0.5 + cycle * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Left mould half */}
      <group ref={leftRef}>
        <mesh position={[-0.5, 0, 0]}>
          <boxGeometry args={[0.9, 1.6, 1.2]} />
          <meshPhysicalMaterial color="#3a4556" {...STEEL} />
        </mesh>
        {/* Cavity */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.1, 20]} />
          <meshPhysicalMaterial color="#1a2030" {...POLISHED} />
        </mesh>
        {/* Guide pins */}
        {[0.5, -0.5].map((y) => (
          <mesh key={y} position={[0, y, 0.35]}>
            <cylinderGeometry args={[0.04, 0.04, 0.3, 8]} />
            <meshPhysicalMaterial color="#7a8694" {...POLISHED} />
          </mesh>
        ))}
      </group>

      {/* Right mould half */}
      <group ref={rightRef}>
        <mesh position={[0.5, 0, 0]}>
          <boxGeometry args={[0.9, 1.6, 1.2]} />
          <meshPhysicalMaterial color="#3a4556" {...STEEL} />
        </mesh>
        {/* Core */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.25, 0.25, 0.08, 20]} />
          <meshPhysicalMaterial color="#4a5568" {...POLISHED} />
        </mesh>
      </group>

      {/* Emerging plastic part — translucent colored */}
      <mesh ref={partRef} position={[0, 0, 0]}>
        <cylinderGeometry args={[0.22, 0.22, 0.12, 20]} />
        <meshPhysicalMaterial
          color="#3b82f6"
          metalness={0.0}
          roughness={0.2}
          transmission={0.4}
          thickness={0.5}
          ior={1.5}
          clearcoat={1.0}
          transparent
          opacity={0.7}
        />
      </mesh>

      {/* Ejector plate below */}
      <mesh position={[0, -1.2, 0]}>
        <boxGeometry args={[2.5, 0.2, 1.4]} />
        <meshPhysicalMaterial color="#4a5568" {...STEEL} roughness={0.5} />
      </mesh>
    </group>
  );
}

// ============================================================
// VARIANT: FORGE — Gear + CNC endmill with sparks
// ============================================================
function ForgeVariant() {
  const gearRef = useRef();
  const toolRef = useRef();
  const sparksRef = useRef();
  const groupRef = useRef();

  const sparkCount = 40;
  const { sparkPos, sparkVel, sparkLife } = useMemo(() => {
    const p = new Float32Array(sparkCount * 3);
    const v = new Float32Array(sparkCount * 3);
    const l = new Float32Array(sparkCount);
    for (let i = 0; i < sparkCount; i++) {
      l[i] = Math.random();
    }
    return { sparkPos: p, sparkVel: v, sparkLife: l };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.12) * 0.15 - 0.2;
    }

    // Gear rotates
    if (gearRef.current) {
      gearRef.current.rotation.z += delta * 0.15;
    }

    // Endmill spins and oscillates
    if (toolRef.current) {
      toolRef.current.rotation.y += delta * 10;
      toolRef.current.position.x = Math.sin(t * 0.5) * 0.2;
    }

    // Sparks from contact point
    if (sparksRef.current) {
      const posAttr = sparksRef.current.geometry.attributes.position;
      for (let i = 0; i < sparkCount; i++) {
        sparkLife[i] += delta * 2;
        if (sparkLife[i] > 1) {
          sparkLife[i] = 0;
          const cx = toolRef.current ? toolRef.current.position.x : 0;
          posAttr.array[i * 3] = cx + 0.8;
          posAttr.array[i * 3 + 1] = 0.3;
          posAttr.array[i * 3 + 2] = 0;
          const a = Math.random() * Math.PI * 2;
          const sp = 0.02 + Math.random() * 0.05;
          sparkVel[i * 3] = Math.cos(a) * sp;
          sparkVel[i * 3 + 1] = Math.abs(Math.sin(a)) * sp + 0.01;
          sparkVel[i * 3 + 2] = (Math.random() - 0.5) * sp * 0.5;
        }
        posAttr.array[i * 3] += sparkVel[i * 3];
        posAttr.array[i * 3 + 1] += sparkVel[i * 3 + 1];
        posAttr.array[i * 3 + 2] += sparkVel[i * 3 + 2];
        sparkVel[i * 3 + 1] -= 0.001;
      }
      posAttr.needsUpdate = true;
    }
  });

  // Simple gear shape
  const gearGeo = useMemo(() => {
    const shape = new THREE.Shape();
    const teeth = 18;
    const r = 1.2;
    const inner = r * 0.72;
    const tw = (2 * Math.PI) / teeth;
    for (let i = 0; i < teeth; i++) {
      const a = i * tw;
      const tipS = a + tw * 0.35;
      if (i === 0) shape.moveTo(Math.cos(a) * inner, Math.sin(a) * inner);
      else shape.lineTo(Math.cos(a) * inner, Math.sin(a) * inner);
      shape.lineTo(Math.cos(tipS) * r, Math.sin(tipS) * r);
      shape.lineTo(Math.cos(tipS + tw * 0.3) * r, Math.sin(tipS + tw * 0.3) * r);
      shape.lineTo(Math.cos(a + tw * 0.7) * inner, Math.sin(a + tw * 0.7) * inner);
      shape.lineTo(Math.cos((i + 1) * tw) * inner, Math.sin((i + 1) * tw) * inner);
    }
    shape.closePath();
    const bore = new THREE.Path();
    bore.absarc(0, 0, r * 0.2, 0, Math.PI * 2, false);
    shape.holes.push(bore);
    return new THREE.ExtrudeGeometry(shape, {
      depth: 0.4,
      bevelEnabled: true,
      bevelThickness: 0.04,
      bevelSize: 0.03,
      bevelSegments: 2,
    });
  }, []);

  return (
    <group ref={groupRef} position={[0.3, 0, 0]}>
      {/* Gear */}
      <mesh ref={gearRef} geometry={gearGeo} position={[-0.3, 0, -0.2]}>
        <meshPhysicalMaterial color="#4a5568" {...STEEL} />
      </mesh>

      {/* Workpiece block */}
      <mesh position={[0.8, 0, 0]}>
        <boxGeometry args={[0.8, 0.8, 0.6]} />
        <meshPhysicalMaterial color="#2d3a4a" {...STEEL} />
      </mesh>

      {/* Endmill */}
      <group ref={toolRef} position={[0.8, 0.8, 0]}>
        <mesh>
          <cylinderGeometry args={[0.06, 0.06, 0.8, 10]} />
          <meshPhysicalMaterial color="#8899aa" {...POLISHED} />
        </mesh>
        <mesh position={[0, -0.5, 0]}>
          <coneGeometry args={[0.06, 0.12, 8]} />
          <meshPhysicalMaterial color="#b0bec5" {...POLISHED} />
        </mesh>
      </group>

      {/* Sparks */}
      <points ref={sparksRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" array={sparkPos} count={sparkCount} itemSize={3} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffaa33"
          size={0.04}
          transparent
          opacity={0.9}
          sizeAttenuation
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}

// ============================================================
// VARIANT: INJECTION — Granule stream + barrel + mold
// ============================================================
function InjectionVariant() {
  const groupRef = useRef();
  const granulesRef = useRef();
  const screwRef = useRef();

  const granuleCount = 35;
  const { gPositions, gColors, gSpeeds } = useMemo(() => {
    const pos = [];
    const col = [];
    const spd = [];
    const palette = [
      new THREE.Color("#3b82f6"),
      new THREE.Color("#f59e0b"),
      new THREE.Color("#10b981"),
      new THREE.Color("#ef4444"),
      new THREE.Color("#e2e8f0"),
    ];
    for (let i = 0; i < granuleCount; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = Math.random() * 0.15;
      pos.push([
        Math.cos(a) * r,
        1.5 + Math.random() * 1.5,
        Math.sin(a) * r,
      ]);
      col.push(palette[Math.floor(Math.random() * palette.length)]);
      spd.push(0.4 + Math.random() * 1.0);
    }
    return { gPositions: pos, gColors: col, gSpeeds: spd };
  }, []);

  useFrame(({ clock }, delta) => {
    const t = clock.getElapsedTime();

    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.1) * 0.2 + 0.5;
    }

    // Screw rotates inside barrel
    if (screwRef.current) {
      screwRef.current.rotation.y += delta * 0.8;
    }

    // Granules flow down
    if (granulesRef.current) {
      granulesRef.current.children.forEach((child, i) => {
        if (!child.isMesh) return;
        child.position.y -= 0.006 * gSpeeds[i];
        child.rotation.x = t * gSpeeds[i] * 0.5;
        if (child.position.y < -0.5) {
          child.position.y = 1.5 + Math.random() * 1.0;
          const a = Math.random() * Math.PI * 2;
          const r = Math.random() * 0.15;
          child.position.x = Math.cos(a) * r;
          child.position.z = Math.sin(a) * r;
        }
      });
    }
  });

  return (
    <group ref={groupRef} position={[0, -0.3, 0]}>
      {/* Injection barrel — horizontal */}
      <mesh position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <cylinderGeometry args={[0.3, 0.3, 2.5, 20]} />
        <meshPhysicalMaterial color="#4a5568" {...STEEL} transparent opacity={0.5} side={THREE.DoubleSide} />
      </mesh>

      {/* Screw inside barrel */}
      <group ref={screwRef} position={[0, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <mesh>
          <cylinderGeometry args={[0.12, 0.12, 2.2, 8]} />
          <meshPhysicalMaterial color="#7a8694" {...POLISHED} />
        </mesh>
        {/* Screw flights */}
        <mesh>
          <torusGeometry args={[0.22, 0.03, 6, 24, Math.PI * 6]} />
          <meshPhysicalMaterial color="#8899aa" {...POLISHED} />
        </mesh>
      </group>

      {/* Nozzle */}
      <mesh position={[-1.5, -0.3, 0]} rotation={[0, 0, Math.PI / 2]}>
        <coneGeometry args={[0.3, 0.4, 16]} />
        <meshPhysicalMaterial color="#6b7a8d" {...POLISHED} />
      </mesh>

      {/* Hopper funnel on top */}
      <mesh position={[0.5, 0.6, 0]} rotation={[Math.PI, 0, 0]}>
        <coneGeometry args={[0.5, 1.0, 12, 1, true]} />
        <meshPhysicalMaterial
          color="#3d4a5c"
          {...STEEL}
          side={THREE.DoubleSide}
          transparent
          opacity={0.5}
        />
      </mesh>

      {/* Hopper rim */}
      <mesh position={[0.5, 1.1, 0]}>
        <torusGeometry args={[0.5, 0.03, 6, 24]} />
        <meshPhysicalMaterial color="#6b7a8d" {...POLISHED} />
      </mesh>

      {/* Flowing granules */}
      <group ref={granulesRef} position={[0.5, 0, 0]}>
        {gPositions.map((pos, i) => (
          <mesh key={i} position={pos} scale={[0.5, 0.7, 0.5]}>
            <capsuleGeometry args={[0.04, 0.05, 3, 6]} />
            <meshPhysicalMaterial
              color={gColors[i]}
              metalness={0.0}
              roughness={0.2}
              transmission={0.4}
              thickness={0.4}
              ior={1.5}
              clearcoat={1.0}
              transparent
              opacity={0.85}
            />
          </mesh>
        ))}
      </group>
    </group>
  );
}

// ============================================================
// VARIANT MAP
// ============================================================
const VARIANTS = {
  mould: MouldVariant,
  forge: ForgeVariant,
  injection: InjectionVariant,
};

// ============================================================
// LIGHTING per variant
// ============================================================
function SceneLighting({ variant }) {
  if (variant === "mould") {
    return (
      <>
        <ambientLight intensity={0.08} color="#94a3b8" />
        <directionalLight position={[4, 3, 3]} intensity={0.8} color="#7d9bc1" />
        <pointLight position={[-2, -1, -2]} intensity={2.0} color="#f59e0b" distance={10} decay={2} />
        <pointLight position={[2, 2, 1]} intensity={0.5} color="#60a5fa" distance={8} decay={2} />
      </>
    );
  }
  if (variant === "forge") {
    return (
      <>
        <ambientLight intensity={0.06} color="#94a3b8" />
        <directionalLight position={[5, 4, 2]} intensity={1.0} color="#7d9bc1" />
        <pointLight position={[-3, -2, -2]} intensity={2.5} color="#ff6b1a" distance={12} decay={2} />
        <pointLight position={[3, 3, 2]} intensity={0.6} color="#60a5fa" distance={8} decay={2} />
      </>
    );
  }
  // injection
  return (
    <>
      <ambientLight intensity={0.08} color="#94a3b8" />
      <directionalLight position={[4, 4, 3]} intensity={0.7} color="#7d9bc1" />
      <pointLight position={[-3, -1, 2]} intensity={1.5} color="#f59e0b" distance={10} decay={2} />
      <pointLight position={[2, 2, -2]} intensity={1.0} color="#ff6b1a" distance={10} decay={2} />
      <pointLight position={[0, -2, 3]} intensity={0.4} color="#60a5fa" distance={8} decay={2} />
    </>
  );
}

// ============================================================
// MAIN EXPORT — renders only when in viewport
// ============================================================
/**
 * Toggleable visibility hook — mounts Canvas when in viewport,
 * unmounts when scrolled away to free the WebGL context.
 */
function useVisible(margin = "200px") {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(entry.isIntersecting),
      { rootMargin: margin }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [margin]);

  return [ref, visible];
}

export default function SectionScene({ variant = "mould", className = "" }) {
  const [viewRef, isInView] = useVisible("100px 0px");
  const Variant = VARIANTS[variant];

  if (!Variant) return null;

  return (
    <div ref={viewRef} className={`absolute inset-0 ${className}`}>
      {isInView && (
        <Canvas
          camera={{ position: [0, 0, 4.5], fov: 40 }}
          dpr={[1, 1.2]}
          gl={{
            antialias: true,
            alpha: true,
            powerPreference: "low-power",
            toneMapping: THREE.ACESFilmicToneMapping,
            toneMappingExposure: 1.0,
          }}
          style={{ background: "transparent" }}
        >
          <SceneLighting variant={variant} />
          <Variant />
          <Environment preset="warehouse" />
        </Canvas>
      )}
    </div>
  );
}
