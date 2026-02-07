"use client";

import React from "react";
import { cn } from "@/lib/utils/cn";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
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
  { key: "claims", label: "DOSSIER" },
  { key: "purchase", label: "DEMANDE" },
  { key: "devis", label: "Devis" },
  { key: "stock", label: "Stock" },
];

const BOTTOM_ACTIONS: Array<{ key: NavKey; label: string }> = [

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

function TopIconBtn({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      aria-label={title}
      className={cn(
        "relative grid h-10 w-10 place-items-center rounded-2xl",
        "bg-white/5 text-white/80",
        "hover:bg-white/10 hover:text-white transition"
      )}
    >
      {children}
    </button>
  );
}

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
        active ? "bg-white/12" : "hover:bg-white/5"
      )}
    >
      {/* Icon tile */}
      <span
        className={cn(
          "grid h-11 w-11 place-items-center rounded-2xl",
          active ? "bg-white/10 text-white" : "bg-white/5 text-white/70"
        )}
      >
        <span className="scale-[0.75]">{icon}</span>
      </span>

      {/* Label */}
      <span
        className={cn(
          "text-[15px] font-semibold tracking-wide",
          active ? "text-white" : "text-white/75"
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
  const user = useAppSelector((s) => s.auth.user);

  const initials = (user?.name ?? "SB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("");

  return (
    <>
      {/* overlay mobile */}
      <button
        type="button"
        onClick={onClose}
        className={cn(
          "fixed inset-0 z-40 bg-black/40 backdrop-blur-sm md:hidden",
          mobileOpen ? "block" : "hidden"
        )}
        aria-label="Close sidebar overlay"
      />

      <aside
        className={cn(
          "z-50 shrink-0",
          "fixed inset-y-0 left-0 w-[250px] md:static",
          "md:sticky md:top-0 md:h-[calc(100vh-16px)] md:m-2 ",
          "overflow-hidden",
          "transition-transform md:translate-x-0",
          mobileOpen ? "translate-x-0" : "-translate-x-full",
          // dark gradient like template
          "bg-gradient-to-b from-[#0B1022] via-[#0B0F1C] to-[#060913]",
          "shadow-2xl shadow-black/30"
        )}
      >
        {/* TOP ROW: logo + icons */}
        <div className="flex items-center justify-between px-5 pt-5">
          <div className="flex items-center gap-2">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-white/5">
              <span className="text-[18px] font-black text-white">SB</span>
            </div>
            <div className="text-[16px] font-extrabold text-white/90">
              SageBridge
            </div>
          </div>

          <div className="flex items-center gap-2">
           <TopIconBtn title="Notifications">
              <span className="text-[16px]">🔔</span>
              <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-emerald-500 text-[11px] font-black text-white">
                3
              </span>
            </TopIconBtn>
 {/* 
            <TopIconBtn title="Compte">
              <span className="text-[16px]">👤</span>
              <span className="absolute -right-0.5 -bottom-0.5 h-3 w-3 rounded-full bg-emerald-400 ring-2 ring-[#0B1022]" />
            </TopIconBtn>*/}
          </div>
        </div>

        {/* PROFILE */}
   

        {/* divider */}
        <div className="mx-5 mt-6 h-px bg-white/10" />

        {/* CONTENT */}
        <div className="px-4 pb-6 pt-6">


          <div className="mt-4 space-y-2">
            {NAV.map((it) => (
              <NavItem
                key={it.key}
                active={active === it.key}
                icon={ICONS[it.key]}
                label={it.label}
                onClick={() => {
                  onNavigate(it.key);
                  onClose();
                }}
              />
            ))}
          </div>

          {/* bottom actions */}
          <div className="mt-8">


            <div className="mt-4 space-y-2">
              {BOTTOM_ACTIONS.map((it) => {
                const isLogout = it.key === "logout";
                const isActive = active === it.key;

                return (
                  <button
                    key={it.key}
                    type="button"
                    onClick={() => {
                      if (isLogout) {
                        localStorage.removeItem("sb_token");
                        dispatch(authActions.logout());
                        window.location.href = "/login";
                        return;
                      }
                      onNavigate(it.key);
                      onClose();
                    }}
                    className={cn(
                      "group w-full flex items-center gap-4 rounded-2xl px-4 py-3 text-left transition",
                      isActive ? "bg-white/12" : "hover:bg-white/5"
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-11 w-11 place-items-center rounded-2xl",
                        isActive ? "bg-white/10 text-white" : "bg-white/5 text-white/70",
                        isLogout && "text-rose-200"
                      )}
                    >
                      <span className="scale-[0.75]">{ICONS[it.key]}</span>
                    </span>

                    <span
                      className={cn(
                        "text-[15px] font-semibold tracking-wide",
                        isLogout ? "text-rose-200" : isActive ? "text-white" : "text-white/75"
                      )}
                    >
                      {it.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
