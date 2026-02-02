'use client';

import { PageContent, SectionId } from "../data/content";

type Props = {
  activeSection: SectionId;
  onOpenContact: () => void;
  content: PageContent;
};

const accentBySection: Record<SectionId, string> = {
  about: "#38bdf8",
  services: "#a855f7",
  market: "#22d3ee",
  testimonials: "#f59e0b",
  contact: "#34d399"
};

export default function Sections({
  activeSection,
  onOpenContact,
  content
}: Props) {
  const { sections } = content;

  return (
    <main className="relative z-10 pt-28 md:pt-32">
      {sections.map((section) => {
        const accent = accentBySection[section.id];
        const isActive = activeSection === section.id;

        return (
          <section
            key={section.id}
            id={section.id}
            data-section={section.id}
            className="flex min-h-screen scroll-mt-28 items-center px-6 py-20 md:px-16 lg:px-28"
          >
            <div className="relative w-full overflow-visible">
              <div
                className="pointer-events-none absolute inset-0 opacity-60 transition-opacity duration-700"
                style={{
                  background: `radial-gradient(circle at 20% 20%, ${accent}1a, transparent 30%), radial-gradient(circle at 80% 0%, ${accent}26, transparent 32%), radial-gradient(circle at 40% 80%, ${accent}14, transparent 40%)`,
                  opacity: isActive ? 1 : 0.35
                }}
              />
              <div className="relative grid gap-10 p-2 md:grid-cols-[1.15fr,0.85fr] md:p-4 lg:p-6">
                <div className="space-y-5 md:space-y-6">
                  {section.eyebrow && (
                    <p
                      className="text-xs uppercase tracking-[0.3em]"
                      style={{ color: accent }}
                    >
                      {section.eyebrow}
                    </p>
                  )}
                  <h2 className="text-3xl font-semibold leading-tight md:text-4xl lg:text-5xl">
                    {section.title}
                  </h2>
                  {section.subtitle && (
                    <p className="max-w-3xl text-sm text-slate-200/90 md:text-base">
                      {section.subtitle}
                    </p>
                  )}
                  <p className="max-w-3xl text-sm text-slate-300 md:text-base">
                    {section.body}
                  </p>

                  {section.bullets && (
                    <ul className="space-y-2 text-sm text-slate-200/90 md:text-base">
                      {section.bullets.map((item) => (
                        <li
                          key={item}
                          className="flex items-start gap-3 leading-relaxed"
                        >
                          <span
                            className="mt-1 inline-block h-2 w-2 rounded-full"
                            style={{ backgroundColor: accent }}
                          />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {section.cta && (
                    <button
                      onClick={section.id === "contact" ? onOpenContact : undefined}
                      className="inline-flex items-center justify-center rounded-full border border-white/20 px-4 py-2 text-sm font-medium transition hover:border-white/50 hover:bg-white/10"
                      style={{
                        boxShadow: `0 10px 40px ${accent}33`
                      }}
                    >
                      {section.cta.label}
                    </button>
                  )}
                </div>

                <div className="space-y-4">
                  {section.highlights && (
                    <div className="grid gap-4 sm:grid-cols-2">
                      {section.highlights.map((item) => (
                        <div
                          key={item.title}
                          className="p-2"
                        >
                          <p
                            className="text-xs uppercase tracking-[0.25em] text-white/70"
                            style={{ color: accent }}
                          >
                            {item.title}
                          </p>
                          <p className="mt-2 text-sm text-slate-100/90">
                            {item.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  )}

                  {section.stats && (
                    <div className="grid gap-3 p-1">
                      {section.stats.map((item) => (
                        <div
                          key={item.label}
                          className="flex items-baseline justify-between border-b border-white/10 pb-3 last:border-none last:pb-0"
                        >
                          <span className="text-xs uppercase tracking-[0.2em] text-slate-300/80">
                            {item.label}
                          </span>
                          <span
                            className="text-sm font-semibold md:text-base"
                            style={{ color: accent }}
                          >
                            {item.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </section>
        );
      })}
    </main>
  );
}

