'use client';

import { useState } from "react";

type Props = {
  open: boolean;
  onClose: () => void;
};

export default function ContactModal({ open, onClose }: Props) {
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (evt: React.FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError(null);
    const form = new FormData(evt.currentTarget);
    const payload = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      topic: (form.get("topic") as string) || "",
      message: (form.get("message") as string) || ""
    };
    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error("submit failed");
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        onClose();
      }, 1200);
    } catch {
      setError("送出失敗，請稍後再試");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-3xl border border-white/10 bg-[#0a0f1a] p-6 shadow-2xl">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-white/70">
              Contact
            </p>
            <h3 className="text-xl font-semibold text-white">
              安排顧問會談
            </h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-full border border-white/20 px-3 py-1 text-xs text-white/70 transition hover:border-white/50 hover:text-white"
          >
            關閉
          </button>
        </div>

        {submitted ? (
          <div className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-100">
            已收到您的需求，我們會在一個工作天內回覆。
          </div>
        ) : (
          <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="space-y-1 text-sm text-white/80">
                <span>您的姓名</span>
                <input
                  required
                  name="name"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-white/40"
                  placeholder="王小明"
                />
              </label>
              <label className="space-y-1 text-sm text-white/80">
                <span>Email</span>
                <input
                  required
                  type="email"
                  name="email"
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-white/40"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="space-y-1 text-sm text-white/80">
              <span>想聊的主題</span>
              <input
                name="topic"
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-white/40"
                placeholder="投組檢視、策略諮詢或市場快訊"
              />
            </label>
            <label className="space-y-1 text-sm text-white/80">
              <span>簡述您的需求</span>
              <textarea
                name="message"
                rows={4}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-white outline-none transition focus:border-white/40"
                placeholder="方便的聯繫時段、投資目標、風險偏好…"
              />
            </label>
            <div className="flex justify-end gap-3">
              {error && (
                <span className="text-sm text-amber-200/80">{error}</span>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-full px-4 py-2 text-sm text-white/70 transition hover:text-white"
              >
                取消
              </button>
              <button
                type="submit"
                className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-200"
              >
                送出
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
