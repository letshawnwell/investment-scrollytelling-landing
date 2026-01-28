'use client';

import { pageContent } from "../data/content";

export default function Sections() {
  const { hero, strategy, metrics } = pageContent;

  return (
    <main className="relative z-10">
      <section className="flex min-h-screen items-center px-6 py-24 md:px-16 lg:px-32">
        <div className="max-w-3xl space-y-6">
          {hero.eyebrow && (
            <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
              {hero.eyebrow}
            </p>
          )}
          <h1 className="text-4xl font-semibold leading-tight tracking-tight md:text-6xl">
            {hero.title}
          </h1>
          {hero.subtitle && (
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              {hero.subtitle}
            </p>
          )}
          <p className="max-w-xl text-sm text-slate-400 md:text-base">
            {hero.body}
          </p>
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-24 md:px-16 lg:px-32">
        <div className="grid w-full gap-10 md:grid-cols-[1.2fr,1fr]">
          <div className="space-y-4">
            {strategy.eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
                {strategy.eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-semibold md:text-4xl">
              {strategy.title}
            </h2>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              {strategy.body}
            </p>
          </div>
          {strategy.stats && (
            <div className="grid gap-4 rounded-2xl border border-slate-800/80 bg-slate-950/40 p-6 backdrop-blur">
              {strategy.stats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between border-b border-slate-800/60 pb-3 last:border-none last:pb-0"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-slate-400">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-sky-300 md:text-base">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="flex min-h-screen items-center px-6 py-24 md:px-16 lg:px-32">
        <div className="grid w-full gap-10 md:grid-cols-[1.2fr,1fr]">
          <div className="space-y-4">
            {metrics.eyebrow && (
              <p className="text-xs uppercase tracking-[0.3em] text-sky-400/80">
                {metrics.eyebrow}
              </p>
            )}
            <h2 className="text-2xl font-semibold md:text-4xl">
              {metrics.title}
            </h2>
            <p className="max-w-xl text-sm text-slate-300 md:text-base">
              {metrics.body}
            </p>
          </div>
          {metrics.stats && (
            <div className="grid gap-4 rounded-2xl border border-emerald-500/10 bg-emerald-500/5 p-6 backdrop-blur">
              {metrics.stats.map((item) => (
                <div
                  key={item.label}
                  className="flex items-baseline justify-between border-b border-emerald-500/20 pb-3 last:border-none last:pb-0"
                >
                  <span className="text-xs uppercase tracking-[0.2em] text-emerald-200/80">
                    {item.label}
                  </span>
                  <span className="text-sm font-medium text-emerald-200 md:text-base">
                    {item.value}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

