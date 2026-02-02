export type SectionId =
  | "about"
  | "services"
  | "market"
  | "testimonials"
  | "contact";

export type RingConfig = {
  radius: number;
  tube: number;
  segments: number;
  color: string;
  speed?: number;
  scale?: number;
};

type SectionContent = {
  id: SectionId;
  navLabel: string;
  eyebrow?: string;
  title: string;
  subtitle?: string;
  body: string;
  bullets?: string[];
  highlights?: { title: string; detail: string }[];
  stats?: { label: string; value: string }[];
  cta?: { label: string; href: string };
};

type PageContent = {
  brand: {
    name: string;
    tagline: string;
    phone: string;
    email: string;
    address: string;
  };
  media?: {
    logo?: string;
    wordmark?: string;
    music?: string;
  };
  sections: SectionContent[];
  animation: {
    rings: RingConfig[];
  };
};

export const pageContent: PageContent = {
  brand: {
    name: "Apex Capital Dynamics",
    tagline: "Research-driven wealth partner",
    phone: "02-0000-0000",
    email: "info@apex-capital.tw",
    address: "台北市信義區投資大道 88 號 18 樓"
  },
  media: {
    logo: "/LOGO.png",
    wordmark: "/LOGO-2.png",
    music: "/lvm001310_64k.mp3"
  },
  sections: [
    {
      id: "about",
      navLabel: "關於我們",
      eyebrow: "About",
      title: "以研究驅動的投資顧問團隊",
    subtitle: "長期資本增值的策略設計師，專注透明溝通與風險前置管理。",
    body: "我們融合量化研究、宏觀視角與行為洞察，建立穩健可驗證的決策框架。團隊擁有跨資產經驗，重視風險緩衝、流動性與執行品質，陪伴客戶在波動中仍能持續前進。",
    bullets: [
      "公司理念：穩健成長、透明紀律、風險優先。",
      "團隊介紹：量化研究、基本面研究、資產配置與交易風控組成。",
      "執照認證：具備投顧、證券、基金相關專業資格與合規流程。"
      ]
    },
    {
      id: "services",
      navLabel: "我們的服務",
      eyebrow: "Services",
      title: "從策略到執行，給予可行的投資顧問解方",
      subtitle: "每一份配置建議皆附帶風險假設與應對行動。",
      body: "我們針對個人與機構提供一對一顧問、投組診斷、專題研究，並以情境分析呈現潛在路徑，協助客戶在市場變化前調整資源。",
      bullets: [
        "投資顧問服務：策略諮詢、績效歸因、再平衡建議。",
        "資產配置建議：多情境 Monte Carlo、風險預算與流動性管理。",
        "市場分析：週報與月報、主題深度報告、事件快速拆解。"
      ]
    },
    {
      id: "market",
      navLabel: "市場觀察",
      eyebrow: "Market Watch",
      title: "市場脈動與投資觀點，定期更新",
      subtitle: "用資料、結構與流動性視角閱讀市場。",
      body: "從宏觀政策、產業循環到資金流向，挑選對資產定價最敏感的變數追蹤。每篇分析附帶可執行的觀察清單與情境轉折點，協助客戶提前佈局或減碼。",
      highlights: [],
      stats: []
    },
    {
      id: "testimonials",
      navLabel: "客戶見證",
      eyebrow: "Testimonials",
      title: "與客戶並肩，把策略落地",
      subtitle: "回饋來自可驗證的決策與透明回報。",
      body: "我們的合作涵蓋家族辦公室、企業主、專業投資人與非營利組織。共同特點是以目標為核心，並對風險與流程有一致認知。",
      highlights: [],
      stats: []
    },
    {
      id: "contact",
      navLabel: "聯絡我們",
      eyebrow: "Contact",
      title: "安排顧問會談或索取研究樣稿",
      subtitle: "留下需求，我們會在一個工作天內回覆。",
      body: "無論是投組檢視、策略討論或市場快訊訂閱，都可以透過表單或 Email 與我們聯繫。我們會依照需求安排適合的顧問與資料。",
    bullets: [
      "聯絡表單：留下需求與可聯繫時段。",
      "公司地址：台北市信義區投資大道 88 號 18 樓。",
      "電話 / Email：02-0000-0000 | info@apex-capital.tw。"
    ],
    cta: { label: "立即預約顧問", href: "#" }
    }
  ],
  animation: {
    rings: [
      { radius: 1.5, tube: 0.04, segments: 64, color: "#38bdf8", speed: 1, scale: 1 },
      { radius: 2.2, tube: 0.05, segments: 72, color: "#22d3ee", speed: 1.1, scale: 1 },
      { radius: 3.0, tube: 0.06, segments: 80, color: "#0ea5e9", speed: 1.2, scale: 1 },
      { radius: 3.8, tube: 0.06, segments: 88, color: "#a855f7", speed: 1.3, scale: 1 }
    ]
  }
};

