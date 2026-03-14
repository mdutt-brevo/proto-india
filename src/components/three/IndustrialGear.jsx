import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

/**
 * IndustrialGear — a procedurally generated 3D gear mesh.
 *
 * Creates a gear shape using THREE.js ExtrudeGeometry from a
 * custom Shape with teeth cut into it. Rotates slowly on each frame,
 * like a mould press mechanism idling.
 *
 * @param {number} teeth - Number of gear teeth (default 16)
 * @param {number} radius - Outer radius (default 1)
 * @param {number} depth - Extrusion depth (default 0.3)
 * @param {number} speed - Rotation speed multiplier (default 0.3)
 * @param {string} color - Hex color (default "#475569" — brushed steel)
 */
export default function IndustrialGear({
  teeth = 16,
  radius = 1,
  depth = 0.3,
  speed = 0.3,
  color = "#475569",
  ...props
}) {
  const meshRef = useRef();

  // Rotate gear each frame
  useFrame((_, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.z += delta * speed;
    }
  });

  // Generate gear shape procedurally
  const geometry = useMemo(() => {
    const shape = new THREE.Shape();
    const innerRadius = radius * 0.7;
    const toothHeight = radius - innerRadius;
    const toothWidth = (2 * Math.PI) / teeth;
    const toothTop = toothWidth * 0.3;
    const toothBottom = toothWidth * 0.5;

    for (let i = 0; i < teeth; i++) {
      const angle = i * toothWidth;

      // Bottom-left of tooth
      const bx1 = Math.cos(angle) * innerRadius;
      const by1 = Math.sin(angle) * innerRadius;

      // Top-left of tooth
      const offset1 = angle + (toothWidth - toothTop) / 2;
      const tx1 = Math.cos(offset1) * radius;
      const ty1 = Math.sin(offset1) * radius;

      // Top-right of tooth
      const offset2 = offset1 + toothTop;
      const tx2 = Math.cos(offset2) * radius;
      const ty2 = Math.sin(offset2) * radius;

      // Bottom-right of tooth
      const nextAngle = angle + toothBottom;
      const bx2 = Math.cos(nextAngle) * innerRadius;
      const by2 = Math.sin(nextAngle) * innerRadius;

      // Valley to next tooth
      const valleyEnd = (i + 1) * toothWidth;
      const vx = Math.cos(valleyEnd) * innerRadius;
      const vy = Math.sin(valleyEnd) * innerRadius;

      if (i === 0) {
        shape.moveTo(bx1, by1);
      } else {
        shape.lineTo(bx1, by1);
      }
      shape.lineTo(tx1, ty1);
      shape.lineTo(tx2, ty2);
      shape.lineTo(bx2, by2);
      shape.lineTo(vx, vy);
    }
    shape.closePath();

    // Center hole
    const holePath = new THREE.Path();
    const holeRadius = radius * 0.25;
    holePath.absarc(0, 0, holeRadius, 0, Math.PI * 2, false);
    shape.holes.push(holePath);

    const extrudeSettings = {
      depth,
      bevelEnabled: true,
      bevelThickness: 0.02,
      bevelSize: 0.02,
      bevelSegments: 2,
    };

    return new THREE.ExtrudeGeometry(shape, extrudeSettings);
  }, [teeth, radius, depth]);

  return (
    <mesh ref={meshRef} geometry={geometry} {...props}>
      <meshStandardMaterial
        color={color}
        metalness={0.9}
        roughness={0.45}
        envMapIntensity={0.3}
      />
    </mesh>
  );
}
