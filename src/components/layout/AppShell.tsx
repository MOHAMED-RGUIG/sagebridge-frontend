"use client";

import { useEffect, useMemo, useState } from "react";
import Sidebar, { NavKey } from "./Sidebar";
import Topbar from "./Topbar";

export type RouteKey = NavKey;
const ROUTE_TITLES: Record<RouteKey, string> = {
  claims: "Dossier sinistre",
  claimsView: "Nouveau dossier sinistre",
  purchase: "Demande d'achat",
  purchaseRequestView: "Nouvelle Demande d’achat",
  devis :"Devis",
  devisView :"Demander un devis",
  stock: "Stock",
  option: "Paramètres",
};
export default function AppShell({
  children,
  active,
  onNavigate,
}: {
  children: React.ReactNode;
  active: RouteKey;
  onNavigate: (k: RouteKey) => void;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [mobileOpen]);

  const overlay = useMemo(
    () =>
      mobileOpen ? (
        <div
          className="fixed inset-0 z-30 bg-slate-900/40 backdrop-blur-sm md:hidden"
          onClick={() => setMobileOpen(false)}
        />
      ) : null,
    [mobileOpen]
  );

  return (
  <div className="min-h-screen  ">   
    {overlay}
    <div className="flex">
        <Sidebar
          active={active}
          onNavigate={(k) => {
            onNavigate(k);
            setMobileOpen(false);
          }}
          mobileOpen={mobileOpen}
          onClose={() => setMobileOpen(false)}
        />
      <div className="flex-1 min-w-0 overflow-hidden">
      <div className="origin-top-left scale-[0.75] w-[calc(100%/0.75)]">
          <Topbar
            onOpenSidebar={() => setMobileOpen(true)}
            title={ROUTE_TITLES[active] ?? "Dashboard"}
          />
          <main className="w-full px-4">
            {children}
          </main>
      </div>
      </div>
    </div>
  </div>
  );
}
