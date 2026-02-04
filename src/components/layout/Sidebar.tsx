"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";

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
  { key: "claims", label: "" },
  { key: "purchase", label: "" },
  { key: "devis", label: "" },
  { key: "stock", label: "" },
];

const BOTTOM_ACTIONS: Array<{ key: NavKey; label: string }> = [
  { key: "option", label: "" },
  { key: "logout", label: "" },
];

// ✅ garde tes ICONS tel quel
const ICONS: Record<NavKey, React.ReactNode> = {
  purchase: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M6 8h12l-1 12H7L6 8z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
      <path d="M9 8a3 3 0 0 1 6 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  claims: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  devis: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path d="M9 13l2 2 4-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  stock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  option: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Zm9 4a7.96 7.96 0 0 0-.6-3l2.1-1.6-2-3.4-2.5 1a8.3 8.3 0 0 0-2.6-1.5L14 1h-4l-.4 2.5a8.3 8.3 0 0 0-2.6 1.5l-2.5-1-2 3.4 2.1 1.6A7.96 7.96 0 0 0 3 12c0 1 .2 2 .6 3L1.5 16.6l2 3.4 2.5-1a8.3 8.3 0 0 0 2.6 1.5L10 23h4l.4-2.5a8.3 8.3 0 0 0 2.6-1.5l2.5 1 2-3.4-2.1-1.6c.4-1 .6-2 .6-3Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  logout: (
    <svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#00000">
      <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
    </svg>
  ),
  purchaseRequestView: <span />,
  claimsView: <span />,
  devisView: <span />,
};

function NavItem({
  active,
  icon,
  onClick,
  title,
}: {
  active: boolean;
  icon: React.ReactNode;
  onClick: () => void;
  title?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      aria-label={title}
      className={cn(
        "group grid place-items-center",
        "h-11 w-11 rounded-2xl",
        "transition-all duration-200",
        "",
        // base
        "border-indigo-200/80 text-slate-700",
        // hover
        "hover:border-indigo-300 hover:shadow-md hover:shadow-indigo-200/30",
        // active
        active &&
          "border-indigo-400 bg-indigo-50 text-indigo-700 shadow-lg shadow-indigo-200/40 ring-2 ring-indigo-200/60"
      )}
    >
      <span
        className={cn(
          "transition-transform duration-200",
          "group-hover:scale-[1.06]",
          active && "scale-[1.06]"
        )}
      >
        {icon}
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
  return (
    <aside
      className={cn(
        "z-40 shrink-0",
        // container shape like screenshot
        "w-[70px]",
        "bg-white",
        "",
        "shadow-2xl",
        "md:sticky md:top-0  md:h-[calc(100vh)]",
        "max-md:fixed max-md:inset-y-0 max-md:left-0",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        "max-md:transition-transform"
      )}
    >
      <div className="flex h-full flex-col items-center py-5 mt-5">
        {/* TOP / LOGO */}
        <div className="relative  mb-6 pb-12">
          <div className="grid h-12 w-12 place-items-center mt-6 rounded-2xl border border-indigo-100 bg-white shadow-sm">
            <span className="text-[14px] font-black tracking-tight text-slate-900 ">SB</span>
          </div>

          {/* close on mobile */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="md:hidden absolute -right-2 -top-2 grid h-7 w-7 place-items-center rounded-xl border border-indigo-200 bg-white shadow"
          >
            ✕
          </button>
        </div>

        {/* MAIN NAV */}
        <div className="mt-8 flex flex-col items-center mt-6 gap-3 pt-12 ">
          {NAV.map((it) => (
            <NavItem
              key={it.key}
              active={active === it.key}
              icon={ICONS[it.key]}
              onClick={() => onNavigate(it.key)}
              title={it.key}
              
            />
          ))}
        </div>

        {/* BOTTOM ACTIONS */}
        <div className="mt-auto flex flex-col items-center gap-3 pb-4 ">
          <div className="h-px w-10 bg-indigo-100 mt-5" />

          {BOTTOM_ACTIONS.map((it) => (
            <NavItem
              key={it.key}
              active={active === it.key}
              icon={ICONS[it.key]}
              onClick={() => onNavigate(it.key)}
              title={it.key}
            />
          ))}
        </div>
      </div>
    </aside>
  );
}



{/*"use client";

import { cn } from "@/lib/utils/cn";

export type NavKey = "purchase" | "purchaseRequestView" | "claims" | "claimsView" |"stock" | "option" ;

const NAV: Array<{ key: NavKey; label: string; hint: string }> = [ 
  { key: "claims", label: "Dossier sinistre", hint: "Insertion" },
  { key: "purchase", label: "Demande d'achat", hint: "Insertion" },
  { key: "stock", label: "Stock disponible", hint: "Consultation" },
  { key: "option", label: "Paramétres", hint: "options" },
];

const ICONS: Record<NavKey, React.ReactNode> = {
  purchase: (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M6 8h12l-1 12H7L6 8z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 8a3 3 0 0 1 6 0"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
  
  
  ),
  claims: (
    <svg width="25" height="25" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path
      d="M7 3h7l5 5v13a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M9 13l2 2 4-4"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
  
  ),
  purchaseRequestView: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 7h16M4 12h16M4 17h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  claimsView: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M7 3h10v18H7V3Z" stroke="currentColor" strokeWidth="2" />
      <path d="M9 7h6M9 11h6M9 15h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  stock: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ), 
  option: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
};

function Item({
  active,
  icon,
  label,
  hint,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  hint: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "group relative w-full rounded-[14px] px-3 py-3 text-left transition",
        "focus:outline-none focus:ring-2 focus:ring-[rgba(67,24,255,0.20)]",
        active ? "bg-[rgba(67,24,255,0.08)]" : "hover:bg-surface2"
      )}
    >
      {active ? (
        <span className="absolute left-0 top-2 h-[calc(100%-16px)] w-[4px] rounded-r-full bg-brand" />
      ) : null}

      <div className="flex items-center justify-between gap-3 pl-2">
        <div className="flex items-center gap-3">
          <span
            className={cn(
              "grid h-9 w-9 place-items-center rounded-full bg-surface text-muted shadow-cardSm",
              active && "text-brand"
            )}
          >
            {icon}
          </span>
          <div>
            <div className={cn("text-[14px] font-semibold", active ? "text-text" : "text-text/80")}>{label}</div>
            <div className="text-[12px] text-muted">{hint}</div>
          </div>
        </div>
      </div>
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
  return (
    <aside
      className={cn(
        "z-40 w-[250px] shrink-0 border-r border-border bg-surface text-text",

        "md:sticky md:top-0 md:h-screen",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full",
        "max-md:transition-transform"
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex items-center justify-between px-5 py-6">

          <div>
            <div className="flex items-center gap-2">
<div className="grid h-10 w-10 place-items-center rounded-full bg-brand text-white shadow-cardSm"> <span className="text-[12px] font-black">SB</span>
              </div>
              <div>
<div className="text-[16px] font-extrabold tracking-tight">SageBridge</div>
                <div className="text-[12px] font-medium text-muted">Achats • Sinistres • Stock</div>
              </div>
            </div>
          </div>
          <button
            type="button"
            className="rounded-xl p-2 hover:bg-surface2 md:hidden"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

       <div className="px-5">

          <div className="text-[12px] font-semibold text-muted">MAIN MENU</div>
          <div className="mt-3 space-y-2">
            {NAV.map((it) => (
              <Item
                key={it.key}
                active={active === it.key}
                icon={ICONS[it.key]}
                label={it.label}
                hint={it.hint}
                onClick={() => onNavigate(it.key)}
              />
            ))}
          </div>

        </div>


          <div className="mt-6 overflow-hidden rounded-xl2 border border-border bg-surface px-5 py-5 shadow-cardSm">
            <div className="text-sm font-semibold">Backend ready</div>
            <p className="mt-2 text-[12px] text-muted">
              RTK Query est déjà câblé. Branche Node/Express + SQL Server sans modifier l’UI.
            </p>
            <div className="mt-4 h-2 w-full rounded-full bg-surface2">
              <div className="h-2 w-[65%] rounded-full bg-brand" />
            </div>
          </div>
<div className="mt-auto px-5 py-5 text-xs text-muted">
          v1 • Next.js + TS + Tailwind + Redux
        </div> 
        
      </div>
    </aside>
  );
}*/}



