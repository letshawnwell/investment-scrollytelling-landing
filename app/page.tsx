'use client';

import { useRef } from "react";
import SceneCanvas from "../components/SceneCanvas";
import Sections from "../components/Sections";
import ScrollOrchestrator from "../components/ScrollOrchestrator";

export default function HomePage() {
  const scrollRef = useRef(0);

  return (
    <>
      <SceneCanvas scrollRef={scrollRef} />
      <ScrollOrchestrator scrollRef={scrollRef} />
      <div className="noise-overlay" />
      <Sections />
    </>
  );
}

