"use client";

import { useMemo } from "react";
import { useAppSelector } from "@/store/hooks";

import Button from "@/components/ui/Button";
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
const user = useAppSelector((s) => s.auth.user);

  return (
<header className="sticky top-0 z-20 border-b border-white/40 bg-white backdrop-blur-xl">
  <div className="mx-auto flex w-full max-w-[1400px] items-center justify-between px-4 py-4 md:px-6">
           <div className="flex items-center gap-3">
          <Button
            type="button"
            className="rounded-2xl border border-border bg-white/70 px-3 py-2 text-sm shadow-sm hover:bg-surface2 md:hidden"
            onClick={onOpenSidebar}
          >
            ☰
          </Button>
          <div>
          <div className="mt-5 p-2">
  <h1 className="text-5xl px-7 md:text-5xl font-extrabold tracking-tight
                bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
                 bg-clip-text text-transparent uppercase">
    {title}
  </h1>
  {/* bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
                 bg-clip-text text-transparent*/}
  <div className="h-1 w-20 mx-7 mt-2 rounded-full bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600" />
{/**<p className="text-sm text-slate-500 mt-1">
    Tableau de gestion • Interface moderne
  </p> */}
  
</div>

           {/* <div className="text-xs text-muted">{today}</div>*/} 
          </div>
        </div>

        <div className="flex items-center gap-3 ">
          {/*<div className="hidden md:flex md:w-[300px] lg:w-[380px] items-center gap-2 rounded-full border border-border bg-white px-5 py-3 text-[14px] shadow-cardSm">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z" stroke="rgba(100,116,139,0.9)" strokeWidth="2" />
              <path d="M21 21l-4.35-4.35" stroke="rgba(100,116,139,0.9)" strokeWidth="2" strokeLinecap="round" />
            </svg>
            <span className="text-muted2">Search...</span>
          </div>*/}
     <div className="flex items-center gap-2 rounded-full border border-border bg-white px-2 py-3 shadow-cardSm mt-5">
       {/*  <button
              type="button"
              className="grid h-10 w-10 place-items-center rounded-full hover:bg-surface2"
              aria-label="Notifications"
            >
              🔔
            </button>*/}
        
            <div className="ml-1 flex items-center gap-2 ">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-brand text-[12px] font-black text-white">
              {(user?.name ?? "SB")
  .split(" ")
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0]?.toUpperCase())
  .join("")}
              </div>
              <div className="hidden text-[14px] font-semibold md:block"> {user?.name ?? "—"}</div>
            </div>
           

          </div> 
        
        </div>
      </div>
    </header>
  );
}
