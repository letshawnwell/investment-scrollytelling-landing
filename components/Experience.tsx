'use client';

import { MutableRefObject, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Color, Group, MathUtils, MeshBasicMaterial } from "three";
import { RingConfig, SectionId } from "../data/content";

type ExperienceProps = {
  scrollRef: MutableRefObject<number>;
  activeSection: SectionId;
  audioLevel: number;
  ringConfigs: RingConfig[];
};

const accentColors: Record<SectionId, Color> = {
  about: new Color("#38bdf8"),
  services: new Color("#a855f7"),
  market: new Color("#22d3ee"),
  testimonials: new Color("#f59e0b"),
  contact: new Color("#34d399")
};

const lowColor = new Color("#22c55e"); // 綠
const midColor = new Color("#38bdf8"); // 藍
const highColor = new Color("#f87171"); // 紅
const tempColor = new Color();

const moods: Record<
  SectionId,
  { energy: number; wobble: number; elevation: number; pulse: number }
> = {
  about: { energy: 0.9, wobble: 0.06, elevation: 0.0, pulse: 0.7 },
  services: { energy: 1.2, wobble: 0.08, elevation: 0.25, pulse: 0.9 },
  market: { energy: 1.0, wobble: 0.07, elevation: 0.1, pulse: 1.1 },
  testimonials: { energy: 0.8, wobble: 0.05, elevation: -0.05, pulse: 0.6 },
  contact: { energy: 0.95, wobble: 0.05, elevation: 0.15, pulse: 0.8 }
};

export default function Experience({
  scrollRef,
  activeSection,
  audioLevel,
  ringConfigs
}: ExperienceProps) {
  const groupRef = useRef<Group | null>(null);
  const ringsRef = useRef<Group[]>([]);
  const materialsRef = useRef<MeshBasicMaterial[]>([]);
  const smoothedLevelRef = useRef(0);

  useFrame(({ camera, clock }) => {
    const progress = scrollRef.current; // 0 ~ 1
    const mood = moods[activeSection] ?? moods.about;
    const accent = accentColors[activeSection] ?? accentColors.about;

    // Camera 位置與抬升由捲動 + active section 決定
    const baseZ = 8;
    camera.position.z = baseZ - progress * (3 + mood.energy);
    camera.position.y = progress * 1.6 + mood.elevation;
    camera.lookAt(0, 0, 0);

    // 整體 group 的姿態：用 lerp 讓改變比較順
    if (groupRef.current) {
      const targetX = 0.1 + progress * (0.2 + mood.wobble);
      const targetY = progress * (0.35 + mood.wobble);
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

    const time = clock.getElapsedTime();
    const targetLevel = Math.max(0, audioLevel);
    const lerpFactor =
      targetLevel < smoothedLevelRef.current ? 0.2 : 0.08;
    smoothedLevelRef.current = MathUtils.lerp(
      smoothedLevelRef.current,
      targetLevel,
      lerpFactor
    );
    const level = smoothedLevelRef.current;
    const hasAudio = level > 0.005;
    const beat = hasAudio
      ? Math.sin(time * (1.6 + level * 2) + progress * 0.5) *
        (0.004 + level * 0.08)
      : 0;
    const pulse = 1 + level * 0.08 + beat;

    // 各層 ring 由 progress + mood 決定角度與呼吸
    ringsRef.current.forEach((ring, index) => {
      if (!ring) return;
      const cfg = ringConfigs[index] ?? {
        speed: 1,
        scale: 1
      };
      const direction = index % 2 === 0 ? 1 : -1;
      const speed =
        (cfg.speed ?? 1) *
        (0.6 + mood.energy * 0.5 + index * 0.08);

      const zAngle =
        progress * Math.PI * 2 * (index + 1) * direction * speed +
        time * 0.08 * direction;
      const yAngle =
        progress * Math.PI * 0.5 * direction * (0.8 + mood.wobble);

      ring.rotation.z = zAngle;
      ring.rotation.y = yAngle;

      const wobble =
        (cfg.scale ?? 1) *
        (pulse +
        Math.sin(time * (1 + mood.pulse) + index) *
          mood.wobble *
          (hasAudio ? 0.35 + level * 0.4 : 0));
      ring.scale.setScalar(wobble);
      ring.position.y =
        Math.sin(time * 0.4 + index) * 0.03 * (1 + mood.energy * 0.2);
    });

    materialsRef.current.forEach((material, index) => {
      if (!material) return;
      // 0~1: 綠 -> 藍 -> 紅
      if (level < 0.5) {
        tempColor.copy(lowColor).lerp(midColor, level / 0.5);
      } else {
        tempColor.copy(midColor).lerp(highColor, (level - 0.5) / 0.5);
      }
      // 將 tempColor 與各 section 原本的 accent 混和，保留品牌色調
      tempColor.lerp(accent, 0.25);

      material.color.lerp(tempColor, 0.12);
      material.opacity =
        0.5 +
        mood.energy * 0.2 +
        index * 0.03 +
        (hasAudio ? level * 0.2 : 0);
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
              ref={(mat) => {
                if (mat) materialsRef.current[index] = mat;
              }}
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

