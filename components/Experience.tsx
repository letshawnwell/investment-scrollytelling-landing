'use client';

import { MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MathUtils } from "three";

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

  useFrame(({ camera }) => {
    const progress = scrollRef.current; // 0 ~ 1

    // Camera 位置僅由捲動決定
    const baseZ = 8;
    camera.position.z = baseZ - progress * 4;
    camera.position.y = progress * 1.6;
    camera.lookAt(0, 0, 0);

    // 整體 group 的姿態：用 lerp 讓改變比較順
    if (groupRef.current) {
      const targetX = 0.15 + progress * 0.25;
      const targetY = progress * 0.4;
      groupRef.current.rotation.x = MathUtils.lerp(
        groupRef.current.rotation.x,
        targetX,
        0.08
      );
      groupRef.current.rotation.y = MathUtils.lerp(
        groupRef.current.rotation.y,
        targetY,
        0.08
      );
    }

    // 各層 ring 完全由 progress 決定角度
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      const direction = index % 2 === 0 ? 1 : -1;

      // 捲動一整頁 = 每一圈約轉 1~數圈
      const zAngle =
        progress * Math.PI * 2 * (index + 1) * direction;
      const yAngle = progress * Math.PI * 0.5 * direction;

      ring.rotation.z = zAngle;
      ring.rotation.y = yAngle;
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

