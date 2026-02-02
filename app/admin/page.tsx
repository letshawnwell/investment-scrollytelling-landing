'use client';

import { useEffect, useState } from "react";
import { PageContent, pageContent as defaultContent } from "../../data/content";

const LOGIN_URL = "/api/login";
const LOGOUT_URL = "/api/logout";
const CONTENT_URL = "/api/content";
const UPLOAD_URL = "/api/upload";
const MESSAGES_URL = "/api/messages";
const EXPORT_URL = "/api/messages/export";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loginError, setLoginError] = useState<string | null>(null);
  const [content, setContent] = useState<PageContent>(defaultContent);
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState<string | null>(null);
  const [messagesCount, setMessagesCount] = useState(0);
  const [authInfo, setAuthInfo] = useState<string | null>(null);

  const fetchContent = async () => {
    try {
      const res = await fetch(CONTENT_URL, { credentials: "include" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setContent(data);
      setAuthed(true);
      setAuthInfo("poweradmin");
    } catch {
      setAuthed(false);
      setAuthInfo(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
  }, []);

  useEffect(() => {
    if (!authed) return;
    (async () => {
      try {
        const res = await fetch(MESSAGES_URL, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setMessagesCount(Array.isArray(data) ? data.length : 0);
        }
      } catch {
        /* ignore */
      }
    })();
  }, [authed]);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginError(null);
    const form = new FormData(e.currentTarget);
    const username = form.get("username");
    const password = form.get("password");
    try {
      const res = await fetch(LOGIN_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password })
      });
      if (!res.ok) throw new Error();
      await fetchContent();
    } catch {
      setLoginError("帳號或密碼錯誤");
    }
  };

  const handleLogout = async () => {
    await fetch(LOGOUT_URL, { method: "POST" });
    setAuthed(false);
    setAuthInfo(null);
  };

  const handleSaveContent = async () => {
    setSaving(true);
    setSaveMsg(null);
    try {
      const res = await fetch(CONTENT_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
        credentials: "include"
      });
      if (!res.ok) throw new Error();
      setSaveMsg("已儲存");
    } catch {
      setSaveMsg("儲存失敗");
    } finally {
      setSaving(false);
    }
  };

  const handleUpload = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const file = form.get("file") as File | null;
    if (!file) return;
    const fd = new FormData();
    fd.append("file", file);
    try {
      const res = await fetch(UPLOAD_URL, {
        method: "POST",
        body: fd,
        credentials: "include"
      });
      const data = await res.json();
      if (data?.path) {
        alert(`已上傳: ${data.path}`);
      } else {
        alert("上傳失敗");
      }
    } catch {
      alert("上傳失敗");
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        載入中...
      </div>
    );
  }

  if (!authed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black px-6 text-white">
        <form
          onSubmit={handleLogin}
          className="w-full max-w-sm space-y-4 rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur"
        >
          <div className="space-y-1">
            <label className="text-sm text-white/80">帳號</label>
            <input
              name="username"
              required
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
              placeholder="帳號"
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-white/80">密碼</label>
            <input
              type="password"
              name="password"
              required
              className="w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2 text-white outline-none focus:border-white/50"
              placeholder="•••••••"
            />
          </div>
          {loginError && (
            <div className="rounded-lg border border-amber-500/50 bg-amber-500/10 p-2 text-sm text-amber-100">
              {loginError}
            </div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-white px-4 py-2 text-sm font-semibold text-black transition hover:bg-slate-200"
          >
            登入
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-6 py-10 text-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-6">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-semibold">Admin 控制台</h1>
          <div className="flex items-center gap-3 text-sm text-white/80">
            {authInfo && <span>已登入：{authInfo}</span>}
            <button
              onClick={handleLogout}
              className="rounded-lg border border-white/20 px-3 py-1 text-xs transition hover:border-white/60 hover:bg-white/10"
            >
              登出
            </button>
          </div>
        </div>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">網站內容 (JSON)</h2>
            <button
              onClick={handleSaveContent}
              disabled={saving}
              className="rounded-lg bg-white px-3 py-1 text-sm font-semibold text-black transition hover:bg-slate-200 disabled:opacity-60"
            >
              {saving ? "儲存中..." : "儲存"}
            </button>
          </div>
          <textarea
            className="h-80 w-full rounded-xl border border-white/15 bg-black/30 p-3 font-mono text-xs text-white outline-none focus:border-white/40"
            value={JSON.stringify(content, null, 2)}
            onChange={(e) => {
              try {
                const val = JSON.parse(e.target.value);
                setContent(val);
                setSaveMsg(null);
              } catch {
                setSaveMsg("JSON 解析錯誤");
              }
            }}
          />
          {saveMsg && (
            <p className="mt-2 text-sm text-white/70">{saveMsg}</p>
          )}
          <p className="mt-2 text-xs text-white/60">
            可直接編輯文字、動畫參數（animation.rings）、品牌資訊、CTA 等。
          </p>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <h2 className="mb-2 text-lg font-semibold">上傳 LOGO / 音樂</h2>
          <form
            onSubmit={handleUpload}
            className="flex flex-col gap-2 rounded-xl border border-white/10 bg-black/30 p-3"
          >
            <input
              type="file"
              name="file"
              accept="image/*,audio/*"
              className="text-sm text-white/80"
              required
            />
            <button
              type="submit"
              className="self-start rounded-lg bg-white px-3 py-1 text-sm font-semibold text-black transition hover:bg-slate-200"
            >
              上傳
            </button>
            <p className="text-xs text-white/60">
              上傳後檔案會放在 /public/uploads，下次可在 JSON 裡替換 LOGO/音樂路徑。
            </p>
          </form>
        </section>

        <section className="rounded-2xl border border-white/10 bg-white/5 p-4">
          <div className="mb-2 flex items-center justify-between">
            <h2 className="text-lg font-semibold">聯絡我們表單</h2>
            <a
              href={EXPORT_URL}
              className="rounded-lg border border-white/20 px-3 py-1 text-sm transition hover:border-white/60 hover:bg-white/10"
            >
              匯出 CSV
            </a>
          </div>
          <p className="text-sm text-white/80">
            目前共有 {messagesCount} 筆。聯絡表單提交會儲存在 data/messages.json。
          </p>
        </section>
      </div>
    </div>
  );
}
