'use client';

import { useCallback, useEffect, useRef, useState } from "react";
import SceneCanvas from "../components/SceneCanvas";
import Sections from "../components/Sections";
import ScrollOrchestrator from "../components/ScrollOrchestrator";
import NavBar from "../components/NavBar";
import ContactModal from "../components/ContactModal";
import CircleTaglines from "../components/CircleTaglines";
import {
  PageContent,
  SectionId,
  pageContent as defaultContent
} from "../data/content";

export default function HomePage() {
  const scrollRef = useRef(0);
  const [activeSection, setActiveSection] = useState<SectionId>("about");
  const [contactOpen, setContactOpen] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [content, setContent] = useState<PageContent>(defaultContent);

  const handleNavClick = useCallback((id: SectionId) => {
    setActiveSection(id);
    const target = document.querySelector<HTMLElement>(
      `[data-section="${id}"]`
    );
    if (target) {
      target.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/content");
        if (!res.ok) return;
        const data = await res.json();
        setContent(data);
      } catch {
        // ignore, keep default
      }
    };
    load();
  }, []);

  return (
    <>
      <SceneCanvas
        scrollRef={scrollRef}
        activeSection={activeSection}
        audioLevel={audioLevel}
        ringConfigs={content.animation.rings}
      />
      <CircleTaglines />
      <ScrollOrchestrator
        scrollRef={scrollRef}
        onSectionChange={setActiveSection}
      />
      <div className="noise-overlay" />
      <NavBar
        activeSection={activeSection}
        onNavClick={handleNavClick}
        onAudioLevelChange={setAudioLevel}
        navItems={content.sections.map((s) => ({
          id: s.id,
          label: s.navLabel
        }))}
        brandName={content.brand.name}
        logoSrc={content.media?.logo || "/LOGO.png"}
        wordmarkSrc={content.media?.wordmark || "/LOGO-2.png"}
        audioSrc={content.media?.music || "/lvm001310_64k.mp3"}
      />
      <div className="fixed bottom-4 right-4 z-30 text-[11px] uppercase tracking-[0.4em] text-white/70 opacity-80 transition-opacity duration-500 hover:opacity-0">
        ---捲動瀏覽---
      </div>
      {/* Landing視窗：只顯示 3D 圓圈，內容從下方開始 */}
      <div className="min-h-screen" aria-hidden />
      <Sections
        activeSection={activeSection}
        onOpenContact={() => setContactOpen(true)}
        content={content}
      />
      <ContactModal open={contactOpen} onClose={() => setContactOpen(false)} />
    </>
  );
}

