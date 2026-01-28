'use client';

import { MutableRefObject, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import Experience from "./Experience";
import { EffectComposer, Bloom } from "@react-three/postprocessing";

type SceneCanvasProps = {
  scrollRef: MutableRefObject<number>;
};

export default function SceneCanvas({ scrollRef }: SceneCanvasProps) {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        camera={{ position: [0, 0, 8], fov: 45 }}
        gl={{ antialias: true }}
      >
        <color attach="background" args={["#000000"]} />
        <Suspense fallback={null}>
          <Experience scrollRef={scrollRef} />
          <EffectComposer>
            <Bloom
              intensity={1.5}
              luminanceThreshold={0.2}
              luminanceSmoothing={0.9}
              radius={0.9}
            />
          </EffectComposer>
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} enableRotate={false} />
      </Canvas>
    </div>
  );
}

