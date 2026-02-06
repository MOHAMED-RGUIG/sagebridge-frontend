"use client";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/store/hooks";
import { useEffect, useMemo, useState } from "react";
import Sidebar, { NavKey } from "./Sidebar";
import Topbar from "./Topbar";



export type RouteKey = NavKey;
const ROUTE_TITLES: Record<RouteKey, string> = {
  claims: "Dossier sinistre",
  claimsView: "Nouveau dossier sinistre",
  purchase: "Demande d'achat",
  purchaseRequestView: "Demande d’achat",
  devis :"Devis",
  devisView :"Devis",
  stock: "Stock",
  option: "Paramètres",
  logout:"logout"
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
const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);
const router = useRouter();
 {/* 
useEffect(() => {
  if (!isAuthenticated) router.replace("/login");
}, [isAuthenticated, router]);
*/}

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
  <div className="min-h-screen bg-gradient-to-br from-indigo-10/70 via-white to-cyan-50/70 ">   
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
      <div className="origin-top-left scale-[0.65] w-[calc(100%/0.65)]">
          <Topbar
            onOpenSidebar={() => setMobileOpen(true)}
            title={ROUTE_TITLES[active] ?? "Dashboard"}
          />
          <main className="px-6 mx-4 ">
                <div className="mx-auto w-full max-w-[1500px]">{children}</div>
                
               
         
          </main>
      </div>
      </div>
    </div>
  </div>
  );
}
