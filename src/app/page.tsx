"use client";

import { useEffect, useMemo, useState } from "react";
import AppShell, { RouteKey } from "@/components/layout/AppShell";
import PurchaseRequestView from "@/components/pages/PurchaseRequestView";
import ClaimsView from "@/components/pages/ClaimsView";
import StockView from "@/components/pages/StockView";
import ParameterView from "@/components/pages/Parameter";
import PurchaseList from "@/components/pages/PurchaseList";
import ClaimsList from "@/components/pages/ClaimsList";
function normalizeHash(hash: string): RouteKey | null {
  const h = hash.replace("#", "").trim();
  if (
    h === "purchase" ||
    h === "purchaseRequestView" ||
    h === "claims" ||
    h === "claimsView" ||
    h === "stock" ||
    h === "option"
  ) return h;
  return null;
}

export default function HomePage() {
  const [active, setActive] = useState<RouteKey>("claims");

  useEffect(() => {
    // First load from hash
    const initial = normalizeHash(window.location.hash);
    if (initial) setActive(initial);

    const onHash = () => {
      const v = normalizeHash(window.location.hash);
      if (v) setActive(v);
    };
    window.addEventListener("hashchange", onHash);
    return () => window.removeEventListener("hashchange", onHash);
  }, []);

  const view = useMemo(() => {
    if (active === "purchase") return <PurchaseList />;
    if (active === "claims") return <ClaimsList />;
    if (active === "purchaseRequestView") return <PurchaseRequestView />;
    if (active === "claimsView") return <ClaimsView />;
    if (active === "option") return <ParameterView/>;
    return <StockView />;
  }, [active]);

  return (
    <AppShell
      active={active}
      onNavigate={(k) => {
        setActive(k);
        window.location.hash = k;
      }}
    >
      {view}
    </AppShell>
  );
}
