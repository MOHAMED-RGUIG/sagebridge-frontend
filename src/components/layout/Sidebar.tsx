"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { useAppDispatch } from "@/store/hooks";
import { authActions } from "@/features/auth/authSlice";

export type NavKey =
  | "purchase"
  | "purchaseRequestView"
  | "claims"
  | "claimsView"
  | "devis"
  | "devisView"
  | "stock"
  | "option"
  | "logout";

const NAV: Array<{ key: NavKey; label: string }> = [
  { key: "claims", label: "Dossier sinistre" },
  { key: "purchase", label: "DA" },
  { key: "devis", label: "Devis" },
  { key: "stock", label: "Stock" },
];

const BOTTOM_ACTIONS: Array<{ key: NavKey; label: string }> = [
  { key: "option", label: "Paramètres" },
  { key: "logout", label: "Logout" },
];

// ✅ garde tes ICONS tel quel
const ICONS: Record<NavKey, React.ReactNode> = {
  claims: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M12 2a10 10 0 100 20 10 10 0 000-20zM11 7h2v6h-2zm0 8h2v2h-2z" />
    </svg>
  ),
  purchase: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M7 4h-2l-1 2v2h2l3.6 7.59-1.35 2.44A1.99 1.99 0 0010 20h10v-2h-9.42a.25.25 0 01-.23-.37L11.1 16h6.45a2 2 0 001.79-1.11l3.58-6.49A1 1 0 0022 7H6.21l-.94-2z" />
    </svg>
  ),
  stock: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M3 13h2v-2H3v2zm4 0h14v-2H7v2zm-4 6h2v-2H3v2zm4 0h14v-2H7v2zM3 5v2h18V5H3z" />
    </svg>
  ),
  devis: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M3 3h18v2H3zm2 4h14v14H5z" />
    </svg>
  ),
  option: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M19.14 12.94a7.49 7.49 0 000-1.88l2.03-1.58a.5.5 0 00.12-.64l-1.92-3.32a.5.5 0 00-.6-.22l-2.39.96a7.28 7.28 0 00-1.63-.95l-.36-2.54a.5.5 0 00-.5-.42h-3.84a.5.5 0 00-.5.42l-.36 2.54a7.28 7.28 0 00-1.63.95l-2.39-.96a.5.5 0 00-.6.22L2.71 8.84a.5.5 0 00.12.64l2.03 1.58a7.49 7.49 0 000 1.88l-2.03 1.58a.5.5 0 00-.12.64l1.92 3.32a.5.5 0 00.6.22l2.39-.96c.5.39 1.04.72 1.63.95l.36 2.54a.5.5 0 00.5.42h3.84a.5.5 0 00.5-.42l.36-2.54c.59-.23 1.13-.56 1.63-.95l2.39.96a.5.5 0 00.6-.22l1.92-3.32a.5.5 0 00-.12-.64l-2.03-1.58zM12 15.5A3.5 3.5 0 1112 8a3.5 3.5 0 010 7.5z" />
    </svg>
  ),
  logout: (
    <svg className="h-8 w-8 fill-current" viewBox="0 0 24 24">
      <path d="M10 17l5-5-5-5v3H3v4h7v3zM20 3H12v2h8v14h-8v2h8a2 2 0 002-2V5a2 2 0 00-2-2z" />
    </svg>
  ),
  purchaseRequestView: <span />,
  claimsView: <span />,
  devisView: <span />,
};

function NavItem({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition",
        active
          ? "bg-white shadow-[0_18px_35px_rgba(15,23,42,0.10)]"
          : "hover:bg-white/70"
      )}
    >
      {/* Icon tile */}
      <span
        className={cn(
          "grid h-11 w-11  place-items-center rounded-2xl",
          "shadow-[0_12px_22px_rgba(15,23,42,0.12)]",
          active
            ? "bg-brand text-white shadow-cardSm hover:brightness-[0.98] hover:-translate-y-[7px] active:-translate-y-[1px]"
            : "bg-white text-slate-700"
        )}
      >
        <span className="scale-[0.85]">{icon}</span>
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-[14px] font-semibold",
          active ? "text-slate-900" : "text-slate-600"
        )}
      >
        {label}
      </span>
    </button>
  );
}

export default function Sidebar({
  active,
  onNavigate,
  mobileOpen,
  onClose,
}: {
  active: NavKey;
  onNavigate: (k: NavKey) => void;
  mobileOpen: boolean;
  onClose: () => void;
}) {
  const dispatch = useAppDispatch();

  return (
    <aside
      className={cn(
        "z-40 shrink-0 w-[240px]",
        "bg-white/80 backdrop-blur",
        "border-r border-[hsl(var(--border))]",
        "shadow-[0_20px_60px_rgba(15,23,42,0.08)]",
        "md:sticky md:top-0 md:h-screen",
        "max-md:fixed max-md:inset-y-0 max-md:left-0",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        "max-md:transition-transform"
      )}
    >
      <div className="flex h-full flex-col px-5 py-6">
        {/* Brand */}
<div className="flex items-center gap-3 px-4">
  <div className="grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-fuchsia-600 to-purple-600 shadow-lg">
    <span className="text-white font-bold text-lg tracking-tight">
      SB
    </span>
  </div>

  <div className="font-semibold text-[16px] text-slate-900 tracking-tight">
    SageBridge
  </div>
</div>

        <div className="my-5 h-px bg-slate-200/70" />

        {/* MAIN NAV */}
        <div className="space-y-3">
          {NAV.map((it) => (
            <NavItem
              key={it.key}
              active={active === it.key}
              icon={ICONS[it.key]}
              label={it.label}
              onClick={() => onNavigate(it.key)}
            />
          ))}
        </div>

        {/* Help Card   <div className="mt-6 rounded-3xl bg-gradient-to-br from-slate-700/25 to-slate-400/25 p-5 shadow-[0_18px_40px_rgba(15,23,42,0.12)]">
          <div className="flex items-start gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/90 shadow-sm">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2 4 6v6c0 5 3.5 9 8 10 4.5-1 8-5 8-10V6l-8-4Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="text-slate-700"
                />
              </svg>
            </div>
            <div>
              <div className="text-white text-[16px] font-bold">Need help?</div>
              <div className="mt-1 text-white/85 text-[13px]">
                Please check our docs
              </div>
            </div>
          </div>

          <button
            type="button"
            className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-[13px] font-bold tracking-wide text-slate-900 shadow-[0_12px_20px_rgba(15,23,42,0.10)] hover:brightness-[0.98]"
          >
            DOCUMENTATION
          </button>
        </div>*/}
      

{/* Bottom actions */}
<div className="mt-auto pt-6 space-y-3">

  {/* Upgrade Button */}

 <div className="my-5 h-px bg-slate-200/70" />
 


  {/* Logout Button */}
  <button
    type="button"
    className="group flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left transition hover:bg-rose-50"
    onClick={() => {
      localStorage.removeItem("sb_token");
      dispatch(authActions.logout());
      window.location.href = "/login";
    }}
  >
    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white shadow-[0_12px_22px_rgba(15,23,42,0.12)] text-rose-600 group-hover:bg-rose-600 group-hover:text-white transition">
      {ICONS.logout}
    </span>

    <span className="text-[14px] font-semibold text-rose-600 group-hover:text-rose-700">
      Logout
    </span>
  </button>

</div>

      </div>
    </aside>
  );
}
