"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "../ui/Button";
import { useGetPurchaseRequestsQuery } from "@/lib/api/baseApi";

function useDebouncedValue<T>(value: T, delay = 300) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return debounced;
}

function normStr(v: any) {
  return String(v ?? "").trim().toLowerCase();
}

function includesCI(hay: any, needle: string) {
  const n = normStr(needle);
  if (!n) return true;
  return normStr(hay).includes(n);
}

// "2026-02-07T00:00:00.000Z" -> "2026-02-07"
function toYMD(value: any): string {
  if (!value) return "";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "";
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export default function PurchaseList() {
  const router = useRouter();

  const [filters, setFilters] = useState({
    PSHNUM_0: "",
    CREUSR_0: "",
    YTYPE_0: "",
    YCMPASS_0: "",
    YMATRICULE_0: "",
    PSHFCY_0: "",
    dateFrom: "",
    dateTo: "",
  });

  const debouncedFilters = useDebouncedValue(filters, 350);
  const [filterMode, setFilterMode] = useState<"single" | "range">("single");

  // pagination FRONT
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  // ✅ Fetch ONCE (toutes les lignes)
  const { data, isFetching, isError } = useGetPurchaseRequestsQuery(
    {}, // مهم: arg ثابت
    { refetchOnFocus: false, refetchOnReconnect: true }
  );

  // adapte حسب شكل response ديالك
  const allRows = data?.items ?? [];

  // ✅ Filtrage FRONT
  const filteredRows = useMemo(() => {
    const f = debouncedFilters;

    const from = f.dateFrom ? new Date(f.dateFrom) : null;
    const to = f.dateTo ? new Date(f.dateTo) : null;

    // pour inclure toute la journée "to"
    const endOfDay =
      to && !Number.isNaN(to.getTime())
        ? new Date(to.getFullYear(), to.getMonth(), to.getDate(), 23, 59, 59, 999)
        : null;

    return allRows.filter((r: any) => {
      if (!includesCI(r.PSHNUM_0, f.PSHNUM_0)) return false;
      if (!includesCI(r.CREUSR_0, f.CREUSR_0)) return false;
      if (!includesCI(r.YTYPE_0, f.YTYPE_0)) return false;
      if (!includesCI(r.YCMPASS_0, f.YCMPASS_0)) return false;
      if (!includesCI(r.YMATRICULE_0, f.YMATRICULE_0)) return false;
      if (!includesCI(r.PSHFCY_0, f.PSHFCY_0)) return false;

      // Date filter
      if (f.dateFrom || f.dateTo) {
        const dStr = toYMD(r.EXTORDDAT_0);
        if (!dStr) return false;

        const d = new Date(dStr); // date-only
        if (Number.isNaN(d.getTime())) return false;

        if (from && !Number.isNaN(from.getTime()) && d < from) return false;
        if (endOfDay && d > endOfDay) return false;
      }

      return true;
    });
  }, [allRows, debouncedFilters]);

  // ✅ Total + pages FRONT
  const total = filteredRows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);

  useEffect(() => {
    if (page !== safePage) setPage(safePage);
  }, [page, safePage]);

  useEffect(() => {
    setPage(1);
  }, [debouncedFilters, pageSize]);

  const startIndex = (safePage - 1) * pageSize;
  const pagedRows = useMemo(
    () => filteredRows.slice(startIndex, startIndex + pageSize),
    [filteredRows, startIndex, pageSize]
  );

  const goTo = (p: number) => setPage(Math.min(Math.max(1, p), totalPages));

  const pageNumbers = useMemo(() => {
    const set = new Set<number>();
    set.add(1);
    set.add(totalPages);
    set.add(safePage);
    set.add(safePage - 1);
    set.add(safePage + 1);
    return Array.from(set).filter(n => n >= 1 && n <= totalPages).sort((a, b) => a - b);
  }, [safePage, totalPages]);

  return (
    <div className="space-y-4">
      <Card className="!mt-8">
        <CardHeader title="Rechercher par" subtitle="" right={<div className="flex items-center gap-2" />} />
        <CardContent className="">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between" />
          <div className="grid flex-1 gap-3 md:grid-cols-4">
            <Input
              placeholder="N demande (PSHNUM_0)…"
              value={filters.PSHNUM_0}
              onChange={(e) => setFilters((p) => ({ ...p, PSHNUM_0: e.target.value }))}
            />
            <Input
              placeholder="Demandeur (CREUSR_0)…"
              value={filters.CREUSR_0}
              onChange={(e) => setFilters((p) => ({ ...p, CREUSR_0: e.target.value }))}
            />
            <Input
              placeholder="Type (YTYPE_0)…"
              value={filters.YTYPE_0}
              onChange={(e) => setFilters((p) => ({ ...p, YTYPE_0: e.target.value }))}
            />
            <Input
              placeholder="Compagnie (YCMPASS_0)…"
              value={filters.YCMPASS_0}
              onChange={(e) => setFilters((p) => ({ ...p, YCMPASS_0: e.target.value }))}
            />
            <Input
              placeholder="Matricule (YMATRICULE_0)…"
              value={filters.YMATRICULE_0}
              onChange={(e) => setFilters((p) => ({ ...p, YMATRICULE_0: e.target.value }))}
            />
            <Input
              placeholder="Site (PSHFCY_0)…"
              value={filters.PSHFCY_0}
              onChange={(e) => setFilters((p) => ({ ...p, PSHFCY_0: e.target.value }))}
            />

            <div className="flex gap-2 md:col-span-2">
              <Select
                value={filterMode}
                onChange={(e) => {
                  const mode = e.target.value as "single" | "range";
                  setFilterMode(mode);
                  setFilters((p) => ({ ...p, dateFrom: "", dateTo: "" }));
                }}
              >
                <option value="single">Date précise</option>
                <option value="range">Intervalle</option>
              </Select>

              {filterMode === "single" ? (
                <Input
                  type="date"
                  value={filters.dateFrom || ""}
                  onChange={(e) => {
                    const d = e.target.value;
                    setFilters((p) => ({ ...p, dateFrom: d, dateTo: d }));
                  }}
                />
              ) : (
                <div className="flex gap-2">
                  <Input
                    type="date"
                    value={filters.dateFrom || ""}
                    onChange={(e) => setFilters((p) => ({ ...p, dateFrom: e.target.value }))}
                  />
                  <Input
                    type="date"
                    value={filters.dateTo || ""}
                    onChange={(e) => setFilters((p) => ({ ...p, dateTo: e.target.value }))}
                  />
                </div>
              )}

              <div className="flex justify-end ">
                <Button
                  type="button"
                  variant="primary"
                  onClick={() => {
                    window.location.hash = "purchaseRequestView";
                    window.dispatchEvent(new Event("hashchange"));
                  }}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand text-white shadow-cardSm hover:brightness-[0.98] hover:-translate-y-[7px] active:-translate-y-[1px] px-6 py-3 mb-14 w-full md:w-[30px] text-lg text-white h-[50px] shadow-md shadow-indigo-500/30 transition-all duration-200 hover:scale-[1.03] hover:shadow-lg active:scale-[0.92]"
                >
                  +
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="!mt-8">
        <CardContent className="pt-8">
          <div className="overflow-x-auto">
            <div className="px-9 pt-3 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent mb-2">
              <h3 className="flex flex-col items-start justify-center m-2 ml-0">
                <span className="mr-3 !font-bold text-slate-900 !text-3xl">Liste des demandes d'achats</span>
              </h3>

              <div className="flex items-center gap-2">
                <Badge tone={isError ? "red" : isFetching ? "amber" : "green"}>
                  {isError ? "Erreur" : isFetching ? "Chargement" : "OK"}
                </Badge>
                <Badge tone="slate">{total} demande(s)</Badge>

                <Select
                  value={pageSize}
                  onChange={(e) => {
                    setPageSize(Number(e.target.value));
                    setPage(1);
                  }}
                >
                  <option value={5}>Afficher 5 lignes</option>
                  <option value={10}>Afficher 10 lignes</option>
                  <option value={20}>Afficher 20 lignes</option>
                  <option value={50}>Afficher 50 lignes</option>
                </Select>
              </div>
            </div>

            <table className="w-full my-0 align-middle text-slate-900 !border !border-dashed !rounded-4xl">
              <thead className="align-bottom !bg-black !text-white">
                <tr className="font-bold !text-xl">
                  <th className="p-3 text-center">N demande</th>
                  <th className="p-3 text-center">Demandeur</th>
                  <th className="p-3 text-center">Type</th>
                  <th className="p-3 text-center">Date</th>
                  <th className="p-3 text-center">Compagnie</th>
                  <th className="p-3 text-center">Matricule</th>
                  <th className="p-3 text-center">Qt</th>
                  <th className="p-3 text-center">Site</th>
                  <th className="p-3 text-center">Détails</th>
                </tr>
              </thead>

              <tbody>
                {pagedRows.map((r: any) => (
                  <tr key={r.PSHNUM_0} className="border-b border-dashed !text-xl hover:bg-white/60">
                    <td className="p-3 text-center font-semibold">{r.PSHNUM_0}</td>
                    <td className="p-3 text-center">{r.CREUSR_0 ?? "—"}</td>
                    <td className="p-3 text-center">{r.YTYPE_0 ?? "—"}</td>
                    <td className="p-3 text-center">
                      {r.EXTORDDAT_0 ? new Date(r.EXTORDDAT_0).toLocaleDateString() : "—"}
                    </td>
                    <td className="p-3 text-center">{r.YCMPASS_0 ?? "—"}</td>
                    <td className="p-3 text-center">{r.YMATRICULE_0 ?? "—"}</td>
                    <td className="p-3 text-center">{r.QTYPUU_0 ?? 0}</td>
                    <td className="p-3 text-center">{r.PSHFCY_0 ?? "—"}</td>
                    <td className="p-3 text-center">
                     <button
  type="button"
 onClick={() => {
  const p = new URLSearchParams(window.location.search);
  p.set("pshnum_0", r.PSHNUM_0);

  // 1) met ?pshnum=...
  const nextUrl = `${window.location.pathname}?${p.toString()}#purchaseRequestView`;

  window.history.pushState({}, "", nextUrl);

  // 2) active la vue
  window.dispatchEvent(new Event("hashchange"));
}}
  className="ml-auto inline-flex h-[28px] w-[28px] items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
  title="Détails"
>
  👁
</button>

                    </td>
                  </tr>
                ))}

                {!isFetching && pagedRows.length === 0 ? (
                  <tr>
                    <td className="py-10 text-center text-slate-500" colSpan={9}>
                      Aucune demande trouvée.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>

          <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-stone-200 pt-5 md:flex-row md:items-center md:justify-between">
            <div className="!text-lg text-slate-500">
              Page <span className="font-semibold text-slate-900">{safePage}</span> /{" "}
              <span className="font-semibold text-slate-900">{totalPages}</span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <Button
                type="button"
                onClick={() => goTo(safePage - 1)}
                disabled={safePage === 1}
                className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black"
              >
                ‹
              </Button>

              <div className="flex items-center gap-1">
                {pageNumbers.map((n, i) => {
                  const prev = pageNumbers[i - 1];
                  const showDots = i > 0 && n - prev > 1;

                  return (
                    <div key={n} className="flex items-center gap-1">
                      {showDots ? <span className="px-1 text-sm text-slate-400">…</span> : null}
                      <Button
                        type="button"
                        onClick={() => goTo(n)}
                        className={
                          n === safePage
                            ? "grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-white !text-xl"
                            : "grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black"
                        }
                      >
                        {n}
                      </Button>
                    </div>
                  );
                })}
              </div>

              <Button
                type="button"
                onClick={() => goTo(safePage + 1)}
                disabled={safePage === totalPages}
                className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black"
              >
                ›
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
