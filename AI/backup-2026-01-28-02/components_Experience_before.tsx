'use client';

import { MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group } from "three";

type ExperienceProps = {
  scrollRef: MutableRefObject<number>;
};

const ringConfigs = [
  { radius: 1.5, tube: 0.04, segments: 64, color: "#38bdf8" },
  { radius: 2.2, tube: 0.05, segments: 72, color: "#22d3ee" },
  { radius: 3.0, tube: 0.06, segments: 80, color: "#0ea5e9" },
  { radius: 3.8, tube: 0.06, segments: 88, color: "#a855f7" }
];

export default function Experience({ scrollRef }: ExperienceProps) {
  const groupRef = useRef<Group | null>(null);
  const ringsRef = useRef<Group[]>([]);

  useFrame(({ camera }, delta) => {
    const progress = scrollRef.current; // 0 ~ 1

    // Camera moves slowly through the ring structure
    const baseZ = 8;
    camera.position.z = baseZ - progress * 4;
    camera.position.y = progress * 1.6;
    camera.lookAt(0, 0, 0);

    // Overall group subtle rotation
    if (groupRef.current) {
      groupRef.current.rotation.y += delta * 0.05;
      groupRef.current.rotation.x = 0.15 + progress * 0.25;
    }

    // Individual ring rotations with scroll influence
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      const direction = index % 2 === 0 ? 1 : -1;
      const baseSpeed = 0.2 + index * 0.07;
      const scrollBoost = 0.8 * progress;
      const speed = (baseSpeed + scrollBoost) * direction;

      ring.rotation.z += delta * speed;
      ring.rotation.y = progress * (index + 1) * 0.35 * direction;
    });
  });

  return (
    <group ref={groupRef}>
      {ringConfigs.map((cfg, index) => (
        <group
          key={index}
          ref={(el) => {
            if (el) ringsRef.current[index] = el;
          }}
        >
          <mesh>
            <torusGeometry
              args={[cfg.radius, cfg.tube, 32, cfg.segments]}
            />
            <meshBasicMaterial
              color={new Color(cfg.color)}
              wireframe
              transparent
              opacity={0.9}
            />
          </mesh>
        </group>
      ))}
    </group>
  );
}

