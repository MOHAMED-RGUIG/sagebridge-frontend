"use client";
import { useEffect, useMemo, useState } from "react";

import { useGetStockQuery } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stockActions } from "@/features/stock/stockSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";

export default function StockView() {
  const dispatch = useAppDispatch();
  const query = useAppSelector((s) => s.stock.query);

  const { data, isFetching, isError } = useGetStockQuery(
    { q: query.q || undefined, site: query.site || undefined },
    {
      // Pendant le dev, on peut laisser refetch; en prod, adapter.
      refetchOnFocus: false,
      refetchOnReconnect: true,
    }
  );

  const rows = useMemo(() => data ?? [], [data]);
  const [pageSize, setPageSize] = useState(5);
  const [page, setPage] = useState(1);
  
  useEffect(() => {
    // reset page quand on change la recherche/site ou quand la data change
    setPage(1);
  }, [query.q, query.site, rows.length]);
  
  const total = rows.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  
  const startIndex = (safePage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);
  const pagedRows = useMemo(() => rows.slice(startIndex, endIndex), [rows, startIndex, endIndex]);
  
  function goTo(p: number) {
    setPage(Math.min(Math.max(1, p), totalPages));
  }
  
  const pageNumbers = useMemo(() => {
    // pagination compacte: 1 ... (p-1) p (p+1) ... last
    const set = new Set<number>();
    set.add(1);
    set.add(totalPages);
    set.add(safePage);
    set.add(safePage - 1);
    set.add(safePage + 1);
  
    const arr = Array.from(set)
      .filter((n) => n >= 1 && n <= totalPages)
      .sort((a, b) => a - b);
  
    return arr;
  }, [safePage, totalPages]);
  
  return (
    <div className="space-y-4">
      <Card>
       {/* */} <CardHeader
          title=""
          subtitle=""
          right={
            <div className="flex items-center gap-2">


              <Badge tone={isError ? "red" : isFetching ? "amber" : "green"}>
                {isError ? "Erreur" : isFetching ? "Chargement" : "OK"}
              </Badge>
              <Badge tone="slate">{rows.length} ligne(s)</Badge>
            </div>
          }
        />
        <CardContent>
          <div className="grid gap-3 md:grid-cols-3">
            <Input
              label="Recherche"
              placeholder="Code, désignation…"
              value={query.q}
              onChange={(e) => dispatch(stockActions.setQuery({ q: e.target.value }))}
            />
            <Select
              label="Site"
              value={query.site}
              onChange={(e) => dispatch(stockActions.setQuery({ site: e.target.value }))}
            >
              <option value="SIG">SIG</option>
              <option value="CAS">CAS</option>
              <option value="RAB">RAB</option>
            </Select>
       
          </div>
<div className="mt-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
  <div className="flex items-center gap-3">
    {/* Show */}
    <div className="relative">
      <select
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        className="
          h-10 w-[120px] appearance-none
          rounded-xl border border-border bg-white px-4 pr-9
          text-sm font-medium text-text shadow-sm
          outline-none transition
          focus:ring-2 focus:ring-[rgba(67,24,255,0.15)]
        "
      >
        <option value={5}>Show 5</option>
        <option value={10}>Show 10</option>
        <option value={20}>Show 20</option>
        <option value={50}>Show 50</option>
      </select>
      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted">▾</span>
    </div>

    {/* records input look */}
    <div
      className="
        h-10 w-[260px]
       px-4
        text-sm text-muted 
        flex items-center
      "
    >
      {total} record(s)
    </div>
  </div>
</div>


<div className="mt-3 overflow-hidden rounded-2xl border border-border bg-white shadow-sm">
  <div className="overflow-x-auto">
    <table className="w-full text-left text-sm">
      {/* header gris comme l’image */}
      <thead className="bg-slate-50 text-[12px] font-semibold text-slate-500">
        <tr className="[&>th]:px-5 [&>th]:py-4">
          <th>Code</th>
          <th>Désignation</th>
          <th>Site</th>
          <th>Qte dispo</th>
          <th>UV</th>
          <th className="text-right">Action</th>
        </tr>
      </thead>

      <tbody className="divide-y divide-border">
        {pagedRows.map((r: any, idx: number) => (
          <tr key={r.id ?? idx} className="hover:bg-slate-50/60">
            {/* Code */}
            <td className="px-5 py-4 font-semibold text-text">
              {r.code ?? "—"}
            </td>

            {/* Désignation -> look “Projects” (titre + sous-texte) */}
            <td className="px-5 py-4">
              <div className="font-semibold text-text">
                {r.label ?? r.designation ?? "—"}
              </div>
              <div className="mt-1 text-xs text-muted">
                {/* sous-texte fictif (style seulement) */}
                Détails de la pièce / commentaire
              </div>
            </td>

            <td className="px-5 py-4 text-text/80">{r.site ?? query.site}</td>
            <td className="px-5 py-4 text-text/80">{r.qtyAvailable ?? r.qte ?? 0}</td>
            <td className="px-5 py-4 text-text/80">{r.uv ?? "UN"}</td>

            {/* Action */}
            <td className="px-5 py-4 text-right">
              <button
                type="button"
                className="
                  inline-flex h-9 w-9 items-center justify-center
                  rounded-xl hover:bg-slate-100
                  text-slate-500
                "
                aria-label="Actions"
              >
                ⋯
              </button>
            </td>
          </tr>
        ))}

        {!isFetching && total === 0 ? (
          <tr>
            <td className="px-5 py-10 text-center text-muted" colSpan={6}>
              Aucune donnée. Branche ton backend sur GET /api/stock.
            </td>
          </tr>
        ) : null}
      </tbody>
    </table>
  </div>
</div>

<div className="flex flex-col gap-3 border-t border-border bg-white px-5 py-4 md:flex-row md:items-center md:justify-between">
  <div className="text-xs text-muted">
    Showing{" "}
    <span className="font-semibold text-text">{total ? startIndex + 1 : 0}</span>
    {" "}to{" "}
    <span className="font-semibold text-text">{endIndex}</span>
    {" "}of{" "}
    <span className="font-semibold text-text">{total}</span>
    {" "}Results
  </div>

  <div className="flex items-center justify-end gap-2">
    <button
      type="button"
      onClick={() => goTo(safePage - 1)}
      disabled={safePage === 1}
className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm text-slate-600 shadow-sm ring-1 ring-border hover:bg-slate-50 disabled:opacity-40"
      aria-label="Previous"
    >
      ‹
    </button>

    {/* pages */}
    <div className="flex items-center gap-1">
      {pageNumbers.map((n, i) => {
        const prev = pageNumbers[i - 1];
        const showDots = i > 0 && n - prev > 1;

        return (
          <div key={n} className="flex items-center gap-1">
            {showDots ? <span className="px-1 text-sm text-muted">…</span> : null}

            <button
              type="button"
              onClick={() => goTo(n)}
              className={
                n === safePage
                  ? "grid h-9 w-9 place-items-center rounded-full bg-brand text-white text-sm shadow-sm"
                  : "grid h-9 w-9 place-items-center rounded-full bg-white text-sm text-slate-700 shadow-sm ring-1 ring-border hover:bg-slate-50"
              }
            >
              {n}
            </button>
          </div>
        );
      })}
    </div>

    <button
      type="button"
      onClick={() => goTo(safePage + 1)}
      disabled={safePage === totalPages}
className="grid h-9 w-9 place-items-center rounded-full bg-white text-sm text-slate-600 shadow-sm ring-1 ring-border hover:bg-slate-50 disabled:opacity-40"
      aria-label="Next"
    >
      ›
    </button>
  </div>
</div>
 {/* <p className="mt-3 text-xs text-muted">
            Astuce: pour tester sans backend, tu peux créer un petit serveur mock Express ou utiliser MSW.
          </p> */}
          
        </CardContent>
      </Card>
    </div>
  );
}

