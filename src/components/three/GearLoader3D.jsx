import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import IndustrialGear from "./IndustrialGear";

/**
 * GearLoader3D — a compact 3D gear animation for page loading states.
 * Two interlocking gears spinning in opposite directions.
 * Uses the same realistic PBR materials as the hero scene.
 */
export default function GearLoader3D() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <div className="w-32 h-32">
        <Suspense fallback={null}>
          <Canvas
            camera={{ position: [0, 0, 4], fov: 40 }}
            dpr={[1, 1.5]}
            gl={{ antialias: true, alpha: true }}
            style={{ background: "transparent" }}
          >
            <ambientLight intensity={0.3} color="#94a3b8" />
            <directionalLight position={[3, 3, 3]} intensity={1.2} color="#7d9bc1" />
            <pointLight position={[-2, -1, 2]} intensity={0.8} color="#ff6b1a" distance={8} decay={2} />

            <IndustrialGear
              teeth={14}
              radius={0.9}
              depth={0.3}
              speed={0.8}
              color="#2d3f5e"
              spokes={5}
              position={[-0.5, 0, 0]}
            />
            <IndustrialGear
              teeth={10}
              radius={0.6}
              depth={0.3}
              speed={-1.12}
              color="#4a5568"
              spokes={4}
              position={[0.8, 0.6, 0.01]}
            />

            <Environment preset="warehouse" />
          </Canvas>
        </Suspense>
      </div>
      <p className="text-sm th-subtle font-mono tracking-wider uppercase">
        Machining...
      </p>
    </div>
  );
}
