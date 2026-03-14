import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * IndustrialGear — realistic procedural 3D gear with spokes, hub,
 * bolt holes, and beveled teeth. Uses meshPhysicalMaterial for
 * brushed-metal PBR look with clearcoat reflections.
 */
export default function IndustrialGear({
  teeth = 16,
  radius = 1,
  depth = 0.3,
  speed = 0.3,
  color = "#5a6577",
  spokes = 5,
  ...props
}) {
  const groupRef = useRef();

  useFrame((_, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.z += delta * speed;
    }
  });

  // ── Main gear body (teeth ring) ─────────────────────────────────
  const gearGeometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = radius * 0.72;
    const toothWidth = (2 * Math.PI) / teeth;
    const toothTop = toothWidth * 0.28;

    for (let i = 0; i < teeth; i++) {
      const angle = i * toothWidth;
      const bx1 = Math.cos(angle + toothWidth * 0.05) * innerRadius;
      const by1 = Math.sin(angle + toothWidth * 0.05) * innerRadius;

      const tipStart = angle + (toothWidth - toothTop) / 2;
      const tx1 = Math.cos(tipStart) * radius;
      const ty1 = Math.sin(tipStart) * radius;
      const tx2 = Math.cos(tipStart + toothTop) * radius;
      const ty2 = Math.sin(tipStart + toothTop) * radius;

      const bx2 = Math.cos(angle + toothWidth * 0.55) * innerRadius;
      const by2 = Math.sin(angle + toothWidth * 0.55) * innerRadius;

      const vAngle = (i + 1) * toothWidth;
      const vx = Math.cos(vAngle) * innerRadius;
      const vy = Math.sin(vAngle) * innerRadius;

      if (i === 0) shape.moveTo(bx1, by1);
      else shape.lineTo(bx1, by1);

      shape.lineTo(tx1, ty1);
      shape.lineTo(tx2, ty2);
      shape.lineTo(bx2, by2);
      shape.lineTo(vx, vy);
    }
    shape.closePath();

    // Center bore
    const bore = new THREE.Path();
    bore.absarc(0, 0, radius * 0.22, 0, Math.PI * 2, false);
    shape.holes.push(bore);

    // Spoke cutouts
    const hubOuter = radius * 0.35;
    const cutoutInner = hubOuter + radius * 0.05;
    const cutoutOuter = innerRadius - radius * 0.08;
    const cutoutWidth = (2 * Math.PI) / spokes;
    const cutoutArc = cutoutWidth * 0.55;

    for (let s = 0; s < spokes; s++) {
      const midAngle = s * cutoutWidth + cutoutWidth * 0.5;
      const startA = midAngle - cutoutArc / 2;
      const endA = midAngle + cutoutArc / 2;
      const steps = 12;
      const hole = new THREE.Path();

      hole.moveTo(Math.cos(startA) * cutoutInner, Math.sin(startA) * cutoutInner);
      for (let j = 1; j <= steps; j++) {
        const a = startA + (endA - startA) * (j / steps);
        hole.lineTo(Math.cos(a) * cutoutInner, Math.sin(a) * cutoutInner);
      }
      for (let j = steps; j >= 0; j--) {
        const a = startA + (endA - startA) * (j / steps);
        hole.lineTo(Math.cos(a) * cutoutOuter, Math.sin(a) * cutoutOuter);
      }
      hole.closePath();
      shape.holes.push(hole);
    }

    // Bolt holes
    const boltRadius = radius * 0.04;
    const boltOrbit = hubOuter - radius * 0.02;
    for (let b = 0; b < spokes; b++) {
      const a = (b / spokes) * Math.PI * 2;
      const boltHole = new THREE.Path();
      boltHole.absarc(Math.cos(a) * boltOrbit, Math.sin(a) * boltOrbit, boltRadius, 0, Math.PI * 2, false);
      shape.holes.push(boltHole);
    }

    return new THREE.ExtrudeGeometry(shape, {
      depth,
      bevelEnabled: true,
      bevelThickness: depth * 0.12,
      bevelSize: depth * 0.08,
      bevelSegments: 3,
    });
  }, [teeth, radius, depth, spokes]);

  // ── Hub ring (raised center collar) ─────────────────────────────
  const hubGeometry = useMemo(() => {
    const hubShape = new THREE.Shape();
    hubShape.absarc(0, 0, radius * 0.35, 0, Math.PI * 2, false);
    const hubBore = new THREE.Path();
    hubBore.absarc(0, 0, radius * 0.22, 0, Math.PI * 2, false);
    hubShape.holes.push(hubBore);

    return new THREE.ExtrudeGeometry(hubShape, {
      depth: depth * 1.5,
      bevelEnabled: true,
      bevelThickness: depth * 0.08,
      bevelSize: depth * 0.05,
      bevelSegments: 2,
    });
  }, [radius, depth]);

  return (
    <group ref={groupRef} {...props}>
      <mesh geometry={gearGeometry} position={[0, 0, -depth * 0.5]}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.95}
          roughness={0.35}
          clearcoat={0.3}
          clearcoatRoughness={0.4}
          envMapIntensity={1.2}
          reflectivity={0.8}
        />
      </mesh>
      <mesh geometry={hubGeometry} position={[0, 0, -depth * 0.75]}>
        <meshPhysicalMaterial
          color={color}
          metalness={0.98}
          roughness={0.25}
          clearcoat={0.5}
          clearcoatRoughness={0.2}
          envMapIntensity={1.5}
          reflectivity={0.9}
        />
      </mesh>
    </group>
  );
}
