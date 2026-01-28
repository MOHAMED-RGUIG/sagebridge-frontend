"use client";
import { useEffect, useMemo, useState } from "react";

import { useGetStockQuery } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { stockActions } from "@/features/stock/stockSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Badge from "@/components/ui/Badge";
import Button from "../ui/Button";


export default function ClaimsList() {
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
 {/* <CardHeader
    title=""
    subtitle=""
    right={
      <div className="flex items-center gap-2">
      </div>
    }
  /> */}       
  <CardContent>
    {/*start search and filter section  */}
    <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">

{/* ====== LEFT SIDE (filtres) ====== */}
<div className="grid flex-1 gap-3 md:grid-cols-4">

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

  <Select
    label="Lignes"
    value={pageSize}
    onChange={(e) => setPageSize(Number(e.target.value))}
  >
    <option value={5}>Show 5</option>
    <option value={10}>Show 10</option>
    <option value={20}>Show 20</option>
    <option value={50}>Show 50</option>
  </Select>

  <div className="flex items-end pb-2 text-lg text-muted">
    {total} record(s)
  </div>

</div>

{/* ====== RIGHT SIDE (BOUTON) ====== */}
<div className="flex justify-end">
  <a
    href="#claimsView"
    onClick={(e) => {
      e.preventDefault();
      window.location.hash = "claimsView";
      window.dispatchEvent(new Event("hashchange"));
    }}
    className="
      inline-flex items-center gap-2
      rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600
      px-6 py-3 mb-2 w-full md:w-[100px]
      text-xl font-bold text-white
      shadow-md shadow-indigo-500/30
      transition-all duration-200
      hover:scale-[1.03] hover:shadow-lg
      active:scale-[0.97]
    "
  >
    + Ajouter
  </a>
</div>

</div>
    {/*end search and filter section  */}
      {/* CARD (style Loopple/Riva) */}
      <div className="flex flex-wrap -mx-3 mb-5 mt-4">
        <div className="w-full max-w-full px-3 mb-6 mx-auto">
          <div className="relative flex flex-col break-words min-w-0 bg-clip-border rounded-[.95rem] bg-white">
            <div className="relative flex flex-col min-w-0 break-words border border-dashed bg-clip-border rounded-2xl border-stone-200 bg-slate-50/30">

              {/* HEADER like Riva */}
              <div className="px-9 pt-3 flex justify-between items-stretch flex-wrap min-h-[70px] pb-0 bg-transparent">
                <h3 className="flex flex-col items-start justify-center m-2 ml-0">
                  <span className="mr-3 !font-bold text-slate-900 !text-3xl">
                    Stock Items
                  </span>
                  <span className="mt-1 font-medium text-slate-500 !text-lg">
                    Articles disponibles (filtrés par site / recherche)
                  </span>
                </h3>

        
                    <div className="flex items-center gap-2">
                            <Badge tone={isError ? "red" : isFetching ? "amber" : "green"}>
                            {isError ? "Erreur" : isFetching ? "Chargement" : "OK"}
                            </Badge>
                            <Badge tone="slate">{rows.length} ligne(s)</Badge>   
                      </div>
              
              </div>

              {/* BODY */}
              <div className="flex-auto block py-8 pt-6 px-9">
                <div className="overflow-x-auto">
                  <table className="w-full my-0 align-middle text-slate-900">
                    <thead className="align-bottom ">
                      <tr className="font-bold !text-xl text-slate-500">
                        <th className="pb-3 text-start min-w-[80px]">CODE</th>
                        <th className="pb-3 text-start min-w-[100px]">DÉSIGNATION</th>
                        <th className="pb-3 text-end min-w-[50px]">TITLE</th>
                        <th className="pb-3 text-end min-w-[50px]">SITE</th>
                        <th className="pb-3 text-end min-w-[50px]">QTE DISPO</th>
                        <th className="pb-3 pr-12 text-end min-w-[50px]">UV</th>
                        <th className="pb-3 text-end min-w-[50px]">DETAILS</th>
                      </tr>
                    </thead>

                    <tbody>
                      {pagedRows.map((r: any, idx: number) => (
                        <tr
                          key={r.id ?? idx}
                          className="border-b border-dashed !text-xl last:border-b-0 hover:bg-white/60"
                        >
                          {/* Code */}
                          <td className="p-3 pl-0">
                            <span className="font-semibold text-slate-900">
                              {r.code ?? "—"}
                            </span>
                          </td>

                          {/* Désignation (titre + sous-texte) */}
                          <td className="p-3 pl-0">
                            <div className="flex items-center">
                              {/* mini “avatar” (pure style) */}
                              <div className="relative inline-flex shrink-0 rounded-2xl me-3 h-[46px] w-[46px] items-center justify-center bg-slate-100 text-slate-600 font-semibold">
                                {String(r.code ?? "S").slice(0, 1)}
                              </div>

                              <div className="flex flex-col justify-start">
                                <div className="mb-0.5 font-semibold text-[1rem] leading-snug text-slate-900">
                                  {r.label ?? r.designation ?? "—"}
                                </div>
                                <div className="text-s text-slate-500">
                                  Détails de la pièce / commentaire
                                </div>
                              </div>
                            </div>
                          </td>

                          <td className="p-3  text-end">
                            <span className="font-semibold text-slate-700">
                              {r.site ?? query.site ?? "—"}
                            </span>
                          </td>
                          <td className="p-3 text-end">
                            <span className="font-semibold text-slate-700">
                              {r.site ?? query.site ?? "—"}
                            </span>
                          </td>
                          <td className="p-3  text-end">
                            <span className="font-semibold text-slate-700">
                              {r.qtyAvailable ?? r.qte ?? 0}
                            </span>
                          </td>

                          <td className="p-3 pr-12 text-end">
                            <span className="font-semibold text-slate-700">
                              {r.uv ?? "UN"}
                            </span>
                          </td>

                          {/* Action -> bouton carré “details” */}
                          <td className="p-3 pr-0 text-end">
                            <button
                              type="button"
                              className="ml-auto inline-flex h-[28px] w-[28px] items-center justify-center rounded-2xl bg-slate-100 text-slate-600 transition hover:bg-slate-200 hover:text-slate-900"
                              aria-label="Details"
                              title="Details"
                            >
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.8"
                                stroke="currentColor"
                                className="h-4 w-4"
                              >
                                <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      ))}

                      {!isFetching && total === 0 ? (
                        <tr className="border-b border-dashed last:border-b-0">
                          <td className="py-10 text-center text-slate-500" colSpan={6}>
                            Aucune donnée. Branche ton backend sur GET /api/stock.
                          </td>
                        </tr>
                      ) : null}
                    </tbody>
                  </table>
                </div>

                {/* Pagination (style proche Loopple) */}
                <div className="mt-6 flex flex-col gap-3 border-t border-dashed border-stone-200 pt-5 md:flex-row md:items-center md:justify-between">
                  <div className="!text-lg text-slate-500">
                    Showing{" "}
                    <span className="font-semibold text-slate-900">
                      {total ? startIndex + 1 : 0}
                    </span>{" "}
                    to{" "}
                    <span className="font-semibold text-slate-900">
                      {endIndex}
                    </span>{" "}
                    of{" "}
                    <span className="font-semibold text-slate-900">
                      {total}
                    </span>{" "}
                    Results
                  </div>

                  <div className="flex items-center justify-end gap-2">
                    <Button
                      type="button"
                      onClick={() => goTo(safePage - 1)}
                      disabled={safePage === 1}
                      className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40"
                      aria-label="Previous"
                    >
                      ‹
                    </Button>

                    <div className="flex items-center gap-1">
                      {pageNumbers.map((n, i) => {
                        const prev = pageNumbers[i - 1];
                        const showDots = i > 0 && n - prev > 1;

                        return (
                          <div key={n} className="flex items-center gap-1">
                            {showDots ? (
                              <span className="px-1 text-sm text-slate-400">…</span>
                            ) : null}

                            <Button
                              type="button"
                              onClick={() => goTo(n)}
                              className={
                                n === safePage
                                  ? "grid h-9 w-9 place-items-center rounded-2xl bg-slate-900 text-white !text-xl shadow-sm"
                                  : "grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black text-slate-700 transition hover:bg-slate-200"
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
                      className="grid h-9 w-9 place-items-center rounded-2xl bg-slate-100 !text-xl !text-black bold text-slate-700 transition hover:bg-slate-200 disabled:opacity-40"
                      aria-label="Next"
                    >
                      ›
                    </Button>
                  </div>
                </div>
              </div>

              {/* end body */}
            </div>
          </div>
        </div>
      </div>
  </CardContent>
</Card>
</div>
  );
}
