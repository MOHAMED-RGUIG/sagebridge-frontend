
"use client";

import { cn } from "@/lib/utils/cn";

export type NavKey =
  | "purchase"
  | "purchaseRequestView"
  | "claims"
  | "claimsView"
  | "stock"
  | "option";

const NAV: Array<{ key: NavKey; label: string }> = [
  { key: "claims", label: "Dossier sinistre" },
  { key: "purchase", label: "Demande d'achat" },
  { key: "stock", label: "Stock disponible" },

];
 {/**{ key: "option", label: "Paramétres" }, */} 
// garde ton ICONS tel quel (je ne touche pas)
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
  purchaseRequestView: <span />,
  claimsView: <span />,
  stock: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 6h16v12H4V6Z" stroke="currentColor" strokeWidth="2" />
      <path d="M8 10h8M8 14h5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),
  option: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 2l2 3.5 4-.5-1 4 3 2.5-3 2.5 1 4-4-.5L12 22l-2-3.5-4 .5 1-4L4 11l3-2.5-1-4 4 .5L12 2z"
        stroke="currentColor" strokeWidth="2" strokeLinejoin="round"
      />
    </svg>
  ),
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
        "w-full rounded-2xl px-4 py-3 text-left transition",
        "flex items-center gap-3",
        "focus:outline-none focus:ring-2 focus:ring-violet-500/30",
        active
          ? "bg-gradient-to-r from-[#4318FF] to-[#6D28D9] text-white shadow-lg shadow-violet-500/25"
          : "text-white/80 hover:bg-white/5 hover:text-white"
      )}
    >
      <span
        className={cn(
          "grid h-9 w-9 place-items-center rounded-xl",
          active ? "bg-white/15" : "bg-white/5"
        )}
      >
        {icon}
      </span>
      <span className={cn("text-[14px] font-semibold", active ? "text-white" : "text-white/85")}>
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
  return (
    <aside
      className={cn(
        // ✅ Dark sidebar like image 1
        "z-40 w-[270px] shrink-0 text-white",
        "bg-gradient-to-b from-[#0B0F1C] via-[#0B1022] to-[#070A14]",
        "border-r border-white/5",
        "md:sticky md:top-0 md:h-screen",
        "max-md:fixed max-md:inset-y-0 max-md:left-0 max-md:shadow-2xl",
        mobileOpen ? "max-md:translate-x-0" : "max-md:-translate-x-full ",
        "max-md:transition-transform"
        
      )}
    >
      <div className="flex h-full flex-col scale-[0.92]">
        {/* HEADER (logos/titre) */}
        <div className="flex items-center justify-between px-6 py-6">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-2xl bg-white/10">
              <span className="text-[12px] font-black">SB</span>
            </div>
            <div>
              <div className="text-[18px] font-extrabold tracking-tight">SageBridge</div>
              <div className="text-[12px] text-white/55">Achats • Sinistres • Stock</div>
            </div>
          </div>

          <button
            type="button"
            className="rounded-xl p-2 hover:bg-white/10 md:hidden"
            onClick={onClose}
            aria-label="Fermer"
          >
            ✕
          </button>
        </div>

        {/* NAV */}
        <div className="px-4 mt-6">
          <div className="px-2 mt-6 text-[12px] font-semibold tracking-wide text-white/40">
            MAIN MENU
          </div>

          <div className="mt-4 space-y-3">
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
        </div>

        {/* FOOTER (Settings/Help like image 1) */}
        <div className="mt-auto px-4 pb-6">
          <div className="my-6 h-px bg-white/10" />

          <button
            type="button"
            className="w-full rounded-2xl px-4 py-3 text-left text-white/70 hover:bg-white/5 hover:text-white transition"
            onClick={() => onNavigate("option")}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">⚙️</span>
              <span className="text-[14px] font-semibold">Settings</span>
            </div>
          </button>

          <button
            type="button"
            className="mt-3 w-full rounded-2xl px-4 py-3 text-left text-white/70 hover:bg-white/5 hover:text-white transition"
            onClick={() => alert("Help (placeholder)")}
          >
            <div className="flex items-center gap-3">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-white/5">❓</span>
              <span className="text-[14px] font-semibold">Help</span>
            </div>
          </button>
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



