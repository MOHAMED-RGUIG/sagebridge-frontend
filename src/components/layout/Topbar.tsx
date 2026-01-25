"use client";

import { useMemo } from "react";

export default function Topbar({ onOpenSidebar, title }: { onOpenSidebar: () => void;  title: string; }) {
  const today = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString("fr-FR", {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  return (
    <header className="sticky top-0 z-20 bg-bg">
      <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="rounded-2xl border border-border bg-white/70 px-3 py-2 text-sm shadow-sm hover:bg-surface2 md:hidden"
            onClick={onOpenSidebar}
          >
            ☰
          </button>
          <div>
            <div className="text-3xl font-bold tracking-tight"><h1>{title}</h1></div>
            <div className="text-xs text-muted">{today}</div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] shadow-cardSm md:flex">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="rgba(100,116,139,0.9)" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="rgba(100,116,139,0.9)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-muted2">Search...</span>
          </div>

          <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-2 shadow-cardSm">
            <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface2"
              aria-label="Notifications"
            >
              🔔
            </button>
        
            <div className="ml-1 flex items-center gap-2 pr-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[12px] font-black text-white">
                MR
              </div>
              <div className="hidden text-[14px] font-semibold md:block">Med Rguig</div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
