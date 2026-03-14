import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment } from "@react-three/drei";
import IndustrialGear from "./IndustrialGear";

/**
 * GearLoader3D — a compact 3D gear animation for page loading states.
 * Two interlocking gears spinning in opposite directions.
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
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 3, 3]} intensity={1} />

            <IndustrialGear
              teeth={14}
              radius={0.9}
              depth={0.3}
              speed={0.8}
              color="#1a56db"
              position={[-0.5, 0, 0]}
            />
            <IndustrialGear
              teeth={10}
              radius={0.6}
              depth={0.3}
              speed={-1.12}
              color="#ea580c"
              position={[0.8, 0.6, 0.01]}
            />

            <Environment preset="studio" />
          </Canvas>
        </Suspense>
      </div>
      <p className="text-sm text-surface-800/50 dark:text-white/40 font-mono tracking-wider uppercase">
        Machining...
      </p>
    </div>
  );
}
