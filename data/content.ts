export type SectionId = "hero" | "strategy" | "metrics";

type SectionContent = {
  id: SectionId;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body: string;
  stats?: { label: string; value: string }[];
};

type PageContent = {
  hero: SectionContent;
  strategy: SectionContent;
  metrics: SectionContent;
};

export const pageContent: PageContent = {
  hero: {
    id: "hero",
    eyebrow: "Apex Capital Dynamics",
    title: "Engineering the Mechanics of Long‑Term Value.",
    subtitle: "A research‑driven investment firm for a world in motion.",
    body: "We combine systematic insight, adaptive risk frameworks, and deep market structure research to compound capital through full cycles."
  },
  strategy: {
    id: "strategy",
    eyebrow: "Investment Strategy",
    title: "Structured like machinery. Operated with discretion.",
    body: "Our process blends factor‑based signals with discretionary overlays across global equities, rates, and FX. Regimes shift. Liquidity migrates. Our framework adapts. Signals are continuously re‑weighted based on volatility, liquidity conditions, and macro regime state, aiming to keep portfolios aligned with the true drivers of risk.",
    stats: [
      { label: "Research universe", value: "2,500+ instruments" },
      { label: "Signal horizon", value: "2–24 weeks" },
      { label: "Typical gross exposure", value: "120–260%" }
    ]
  },
  metrics: {
    id: "metrics",
    eyebrow: "Performance Lens",
    title: "A focus on path, not just endpoints.",
    body: "Drawdown control and convexity matter as much as long‑run return. We design portfolios to stay engaged through turbulence: scenario‑based stress testing, regime‑aware risk budgets, and liquidity‑first execution keep the machine running when markets dislocate.",
    stats: [
      { label: "Target volatility", value: "8–12% annualized" },
      { label: "Capital horizon", value: "3–7 years" },
      { label: "Risk framework", value: "Regime‑aware, factor‑driven" }
    ]
  }
};

