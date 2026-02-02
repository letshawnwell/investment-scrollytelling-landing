'use client';

import React from "react";
import Image from "next/image";
import { SectionId } from "../data/content";
import AudioToggle from "./AudioToggle";

type NavItem = { id: SectionId; label: string };

type Props = {
  activeSection: SectionId;
  onNavClick: (id: SectionId) => void;
  onAudioLevelChange?: (level: number) => void;
  navItems: NavItem[];
  brandName: string;
  logoSrc?: string;
  wordmarkSrc?: string;
  audioSrc?: string;
};

export default function NavBar({
  activeSection,
  onNavClick,
  onAudioLevelChange,
  navItems,
  brandName,
  logoSrc = "/LOGO.png",
  wordmarkSrc = "/LOGO-2.png",
  audioSrc
}: Props) {

  const handleClick = (id: SectionId) => (evt: React.MouseEvent) => {
    evt.preventDefault();
    onNavClick(id);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-40">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-6 px-5 py-4 md:px-8">
        <div className="logo-animate relative flex items-center gap-3 overflow-hidden">
          <Image
            src={logoSrc}
            alt="Brand icon"
            width={36}
            height={36}
            priority
            className="h-9 w-9"
          />
          <Image
            src={wordmarkSrc}
            alt={brandName}
            width={180}
            height={32}
            priority
            className="hidden h-7 w-auto sm:block"
          />
        </div>

        <div className="flex items-center gap-4">
          <nav className="hidden items-center gap-3 rounded-full border border-white/10 bg-black/50 px-3 py-2 text-sm backdrop-blur md:flex">
            {navItems.map((item) => {
              const isActive = activeSection === item.id;
              return (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={handleClick(item.id)}
                  className={`rounded-full px-3 py-2 transition ${
                    isActive
                      ? "bg-white/15 text-white"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </a>
              );
            })}
          </nav>
          <div className="hidden md:block">
            <AudioToggle
              onLevelChange={onAudioLevelChange}
              audioSrc={audioSrc}
            />
          </div>
        </div>
      </div>
      <div className="mx-auto block max-w-6xl px-5 pb-3 md:hidden">
        <nav className="flex items-center gap-2 overflow-x-auto rounded-full border border-white/10 bg-black/60 px-3 py-2 text-xs backdrop-blur">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={`#${item.id}`}
                onClick={handleClick(item.id)}
                className={`whitespace-nowrap rounded-full px-3 py-2 transition ${
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                }`}
                aria-current={isActive ? "page" : undefined}
              >
                {item.label}
              </a>
            );
          })}
        </nav>
        <div className="mt-2">
          <AudioToggle
            onLevelChange={onAudioLevelChange}
            audioSrc={audioSrc}
          />
        </div>
      </div>
      <div className="pointer-events-none absolute inset-0 -z-10 bg-gradient-to-b from-black/80 via-black/30 to-transparent" />
    </header>
  );
}
