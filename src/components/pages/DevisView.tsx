"use client";

import { useMemo, useEffect ,useState } from "react";
import { useCreateDevisRequestMutation } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { devisRequestActions } from "@/features/devis/devisSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDispatch } from "react-redux";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
type MatriculeType = "NORMAL" | "AUTRE";
export default function DevisView() {
  const dispatch = useAppDispatch();
 const form = useAppSelector((s) => s.devis.form);

  const [createDevisRequest, { isLoading }] = useCreateDevisRequestMutation();
  const [toast, setToast] = useState<string | null>(null);
  const [matType, setMatType] = useState<MatriculeType>("NORMAL");

  const [mat1, setMat1] = useState("");
  const [mat2, setMat2] = useState("");
  const [mat3, setMat3] = useState("");

    // --- Article picker modal ---
  const [articleModalOpen, setArticleModalOpen] = useState(false);
  const [activeLineId, setActiveLineId] = useState<string | null>(null);


  const [articleQuery, setArticleQuery] = useState("");

  // ✅ Données articles (placeholder). Plus tard tu les remplaces par un fetch API / RTK Query
  const articles = useMemo(
    () => [
      { ITMREF: "ART-001", ITMDES: "Filtre à huile" },
      { ITMREF: "ART-002", ITMDES: "Bougie d’allumage" },
      { ITMREF: "ART-003", ITMDES: "Courroie" },
      { ITMREF: "ART-004", ITMDES: "Plaquettes de frein" },
    ],
    []
  );

  const filteredArticles = useMemo(() => {
    const q = articleQuery.trim().toLowerCase();
    if (!q) return articles;
    return articles.filter(
      (a) =>
        a.ITMREF.toLowerCase().includes(q) ||
        a.ITMDES.toLowerCase().includes(q)
    );
  }, [articleQuery, articles]);

const openArticleModal = (lineId: string) => {
  setActiveLineId(lineId);
  setArticleQuery("");
  setArticleModalOpen(true);
};


  const pickArticle = (a: { ITMREF: string; ITMDES: string }) => {
    if (activeLineId == null) return;

    dispatch(
      devisRequestActions.updateItem({
        id: activeLineId,
        key: "ITMREF",
        value: a.ITMREF,
      })
    );
    dispatch(
      devisRequestActions.updateItem({
        id: activeLineId,
        key: "ITMDES",
        value: a.ITMDES,
      })
    );

    setArticleModalOpen(false);
    setActiveLineId(null);
  };


  const totalLines = form.items.length;
  const isValid = useMemo(() => {
    if (!form.REQUSR.trim()) return false;
    if (!form.PSHFCY.trim()) return false;
    if (!form.YTYPE.trim()) return false;
    if (!form.YCMP.trim()) return false;
    if (form.items.some((it) => !it.ITMREF.trim() || it.QTYPUU <= 0)) return false;
    return true;
  }, [form]);

  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayPlusOne = new Date();
    todayPlusOne.setDate(todayPlusOne.getDate() + 1);

    const datePlusOne = todayPlusOne.toISOString().split("T")[0];
    dispatch(
      devisRequestActions.setField({
        key: "PRQDAT",
        value: today,
       
      })
    );
    dispatch(
      devisRequestActions.setField({
        key : "neededDate",
        value : datePlusOne,
      })
    );
  }, [dispatch]);
  async function onSubmit() {
    setToast(null);
    if (!isValid) {
      setToast("Merci de compléter les champs obligatoires (REQUSR, PSHFCY, articles).");
      return;
    }

    try {
      // Payload prêt backend
      const payload = {
        REQUSR: form.REQUSR,
        PSHFCY: form.PSHFCY,
        YTYPE: form.YTYPE,
        YCMP: form.YCMP,
        CPY: form.CPY,
        PRQDAT: form.PRQDAT || null,
        YMATRICULE: form.YMATRICULE,
     items: form.items.map((it) => ({
  ITMREF: it.ITMREF,
  ITMDES: it.ITMDES,
  QTYPUU: Number(it.QTYPUU),
  neededDate: form.neededDate || null,
  PUU: it.PUU,

  PBRUT: Number(it.PBRUT || 0),
  REMISE: Number(it.REMISE || 0),
  PNET: Number(it.PNET || 0),
})),
      };

      // Appelle l’API (placeholder)
      await createDevisRequest(payload).unwrap();
      dispatch(devisRequestActions.reset());
      setToast("Demande envoyée (API placeholder). Tu pourras brancher le backend ensuite.");
    } catch {
      setToast(
        "Impossible d’envoyer pour le moment (backend non branché ou API indisponible)."
      );
    }
  }
 // Génération automatique quand NORMAL
 useEffect(() => {
  if (matType !== "NORMAL") return;

  const part1 = mat1.trim();
  const part2 = mat2.trim().toUpperCase();
  const part3 = mat3.trim();

  const hasAny = part1 || part2 || part3;
  const value = hasAny ? `${part1}-${part2}-${part3}` : "";

  dispatch(devisRequestActions.setField({ key: "YMATRICULE", value }));
}, [matType, mat1, mat2, mat3, dispatch]);

// Quand on change de type:
// - si AUTRE => on vide les 3 inputs (optionnel) et on laisse le user saisir YMATRICULE
// - si NORMAL => on peut vider YMATRICULE pour repartir clean (optionnel)
useEffect(() => {
  if (matType === "AUTRE") {
    setMat1("");
    setMat2("");
    setMat3("");
    // On ne touche pas YMATRICULE ici: l'utilisateur va le saisir lui-même
  } else {
    // NORMAL: optionnel => reset matricule avant génération
    dispatch(devisRequestActions.setField({ key: "YMATRICULE", value: "" }));
  }
}, [matType, dispatch]);

const matriculeDisabled = matType === "NORMAL";
// --- Valorisation (comme image 3) ---
const money = (n: number) =>
  new Intl.NumberFormat("fr-FR", { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    Number.isFinite(n) ? n : 0
  );

// TVA (modifiable)
const TVA_RATE = 0.2; // 20%

const totals = useMemo(() => {
  const ht = (form.items ?? []).reduce((sum, it) => {
    const qty = Number(it.QTYPUU || 0);
    const netUnit = Number(it.PNET || 0);
    return sum + qty * netUnit;
  }, 0);

  const tva = ht * TVA_RATE;
  const ttc = ht + tva;

  return { ht, tva, ttc };
}, [form.items]);
  
  return (
    <div className="space-y-4 w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
       
       {/*<div>
          <h1 className="text-lg font-semibold">Formulaire de demande d’achat</h1>
          <p className="text-sm text-muted">Insertion • UI moderne • prête backend</p>
        </div> 
        
        <div className="flex items-center gap-2">
          <Badge tone={isValid ? "green" : "amber"}>{isValid ? "Prêt" : "Incomplet"}</Badge>
         
        </div>
        */}
        
      </div>

      {toast ? (
        <div className="rounded-3xl border border-border/70 bg-white/70 px-4 py-3 text-xl shadow-sm backdrop-blur">
          {toast}
        </div>
      ) : null}

      <Card>
        <CardHeader
          title="En-tête"
          subtitle="Informations concernant le devis"
        /> 
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-8">
       
        <Select
            label= "Site *"
            value={form.PSHFCY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "PSHFCY", value: e.target.value }))
            }
            disabled
         className="
                      w-full rounded-4xl border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "
          >
            <option value="SIG">SIG</option>
            <option value="CAS">CAS</option>
            <option value="RAB">RAB</option>
          </Select>
        <Input
            label="Type devis *"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2  
                  "
          />
        <Input
            label="No devis"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
        <Input
            label="Référence"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
   
          <Input
              label="Date *"
              type="date"
              value={form.PRQDAT}
              disabled
              className="
                      w-full rounded-4xl border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "/>

<Input
            label="Client *"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
                  <Input
            label="Nom client"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
                  <Input
            label="Devise"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />


  


<Input
            label="Kilométrage"
          
            type="number"
            /** onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            */
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
               <Input
              label="Date prevu du Repara*"
              type="date"
              value={form.PRQDAT}
          
              className="
                      w-full rounded-4xl border px-3 py-2
                      
                    "/>
        <Input
            label="Référence Sinistre"
            value={form.CPY}
            onChange={(e) =>
              dispatch(devisRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            
            className="
                    w-full rounded-4xl border px-3 py-2 
                  "
          />
            <div className="w-full space-y-3">
  {/* SELECT TYPE */}
  <div className="w-full">

    <Select
      label="Type matricule"
      className="h-10 w-full rounded-4xl border border-border bg-white px-3"
      value={matType}
      onChange={(e) => setMatType(e.target.value as MatriculeType)}
    >
      <option value="NORMAL">Normal</option>
      <option value="AUTRE">Autre</option>
    </Select>
  </div>

  {/* 3 INPUTS */}
  {matType === "NORMAL" && (
    <div className="grid w-full grid-cols-1 gap-3 md:grid-cols-3">
      <Input label="" value={mat1} onChange={(e) => setMat1(e.target.value)} />
      <Input label="" value={mat2} onChange={(e) => setMat2(e.target.value.toUpperCase())} />
      <Input label="" value={mat3} onChange={(e) => setMat3(e.target.value)} />
    </div>
  )}

  {/* INPUT FINAL */}
  <div className="w-full">
    <Input
      label="Matricule"
      value={form.YMATRICULE}
      disabled={matriculeDisabled}
      placeholder={matriculeDisabled ? "Généré automatiquement" : "Saisir matricule"}
      onChange={(e) =>
        dispatch(
          devisRequestActions.setField({
            key: "YMATRICULE",
            value: e.target.value,
          })
        )
      }
    />
  </div>
</div>
        </CardContent>
        
      </Card>

      <Card>
        <CardHeader
          title="Détails"
          subtitle="Ajoute une ou plusieurs lignes "
         
          right={
            <div className="flex items-center gap-2">
            <Badge tone="green">{totalLines} ligne(s)</Badge>
            <Button
              variant="secondary"
              onClick={() => dispatch(devisRequestActions.addItem())}
              type="button"
            >
              + Ajouter une ligne
            </Button>
            </div>
          }
        />
        <CardContent>
      <div className="overflow-x-auto">
  <table className="w-full min-w-[1200px] text-left text-sm">
    <thead className="bg-surface2 text-xs uppercase tracking-wide text-muted">
      <tr className="text-[12px] font-semibold text-slate-700">
        <th className="px-3 py-2">Article</th>
        <th className="px-3 py-2">Désignation</th>
        <th className="px-3 py-2">UV</th>
        <th className="px-3 py-2 text-right">Quantité</th>
        <th className="px-3 py-2 text-right">Prix brut</th>
        <th className="px-3 py-2 text-right">Remise %</th>
        <th className="px-3 py-2 text-right">Prix net</th>
        <th className="px-3 py-2 text-right">Montant</th>

        <th className="px-3 py-2 text-right"></th>
      </tr>
    </thead>

    <tbody className="divide-y divide-border/70">
      {form.items.map((it) => (
        <tr key={it.id} className="hover:bg-surface2">
          {/* Article */}
          <td className="px-3 py-2 w-[220px]">
            <div className="relative">
              <Input
                value={it.ITMREF}
                onChange={(e) =>
                  dispatch(
                    devisRequestActions.updateItem({
                      id: it.id,
                      key: "ITMREF",
                      value: e.target.value,
                    })
                  )
                }
                className="h-10 w-full rounded-[14px] border border-border bg-white px-4 pr-11 text-[14px] outline-none transition placeholder:text-muted2 focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
                placeholder="Ex: ART-001"
              />

              <button
                type="button"
                onClick={() => openArticleModal(it.id)}
                className="absolute right-2 top-1/2 -translate-y-1/2 grid h-8 w-8 place-items-center rounded-xl border border-border bg-white text-muted2 hover:bg-gray-50"
                title="Choisir un article"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path
                    d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
                    stroke="currentColor"
                    strokeWidth="2"
                  />
                  <path
                    d="M16.5 16.5 21 21"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            </div>
          </td>

          {/* Désignation */}
          <td className="px-3 py-2 w-[320px]">
            <Input
              value={it.ITMDES}
              disabled
              className="h-10 w-full rounded-[14px] border border-gray-300 bg-gray-100 px-4 text-[14px] text-gray-500 outline-none"
              placeholder="Désignation"
            />
          </td>

          {/* UV */}
          <td className="px-3 py-2 w-[120px]">
            <Select
              value={it.PUU}
              onChange={(e) =>
                dispatch(
                  devisRequestActions.updateItem({
                    id: it.id,
                    key: "PUU",
                    value: e.target.value,
                  })
                )
              }
              className="h-10 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
            >
              <option value="UN">UN</option>
              <option value="PCS">PCS</option>
              <option value="KG">KG</option>
              <option value="L">L</option>
            </Select>
          </td>

          {/* Quantité */}
          <td className="px-3 py-2 w-[140px] text-right">
            <Input
              type="number"
              min={1}
              value={it.QTYPUU}
              onChange={(e) =>
                dispatch(
                  devisRequestActions.updateItem({
                    id: it.id,
                    key: "QTYPUU",
                    value: Number(e.target.value),
                  })
                )
              }
              className="h-10 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] text-right tabular-nums outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
            />
          </td>

          {/* Prix brut */}
          <td className="px-3 py-2 w-[160px] text-right">
            <Input
              type="number"
              min={0}
              step="0.01"
              value={it.PBRUT}
              onChange={(e) =>
                dispatch(
                  devisRequestActions.updateItem({
                    id: it.id,
                    key: "PBRUT",
                    value: Number(e.target.value),
                  })
                )
              }
              className="h-10 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] text-right tabular-nums outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
            />
          </td>

          {/* Remise */}
          <td className="px-3 py-2 w-[140px] text-right">
            <Input
              type="number"
              min={0}
              max={100}
              step="0.01"
              value={it.REMISE}
              onChange={(e) =>
                dispatch(
                  devisRequestActions.updateItem({
                    id: it.id,
                    key: "REMISE",
                    value: Number(e.target.value),
                  })
                )
              }
              className="h-10 w-full rounded-[14px] border border-border bg-white px-4 text-[14px] text-right tabular-nums outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
            />
          </td>

          {/* Prix net */}
          <td className="px-3 py-2 w-[170px] text-right">
            <Input
              value={Number(it.PNET || 0).toFixed(2)}
              disabled
              className="h-10 w-full rounded-[14px] border border-gray-300 bg-gray-100 px-4 text-[14px] text-right tabular-nums text-gray-700 outline-none"
            />
          </td>
             {/* Montant */}
<td className="px-3 py-2 w-[170px] text-right">
  <Input
    value={Number((it.QTYPUU || 0) * (it.PNET || 0)).toFixed(2)}
    disabled
    className="h-10 w-full rounded-[14px] border border-gray-300 bg-gray-100 px-4 text-[14px] text-right tabular-nums text-gray-700 outline-none"
  />
</td>

          {/* Delete */}
          <td className="px-3 py-2 text-right w-[64px]">
            <Button
              variant="ghost"
              type="button"
              onClick={() => dispatch(devisRequestActions.removeItem(it.id))}
              title="Supprimer"
              className="h-10 w-11 text-3xl rounded-xl"
            >
              🗑
            </Button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>
{/* VALORISATION (comme image 3) */}
<div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-12">
  {/* (optionnel) espace à gauche pour ressembler à l'image 3 */}
  <div className="md:col-span-7" />

  <div className="md:col-span-5">
    <div className="rounded-2xl border border-border bg-white p-4 shadow-sm">
      <div className="text-center text-[17px] font-bold text-brand">Valorisation</div>

      <div className="mt-4 space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-[13px] text-muted2">Hors taxe</div>
          <div className="tabular-nums text-[12px] font-semibold">{money(totals.ht)}</div>
        </div>

        <div className="flex items-center justify-between">
          <div className="text-[13px] text-muted2">TVA ({Math.round(TVA_RATE * 100)}%)</div>
          <div className="tabular-nums text-[12px] font-semibold">{money(totals.tva)}</div>
        </div>

        <div className="h-px bg-border/70" />

        <div className="flex items-center justify-between">
          <div className="text-[14px] font-semibold">TTC</div>
          <div className="tabular-nums text-[16px] font-extrabold">{money(totals.ttc)}</div>
        </div>
      </div>
    </div>
  </div>
</div>


          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
   <Button variant="secondary" type="button" onClick={() => dispatch(devisRequestActions.reset())}>
  Réinitialiser
</Button>

            <Button type="button"  onClick={onSubmit} disabled={isLoading}>
              {isLoading ? "Envoi..." : "Envoyer"}
            </Button>
          </div>
        </CardContent>
      </Card>
            {/* --- Article Picker Modal --- */}
      {articleModalOpen ? (
        <div className="fixed inset-0 z-50">
          {/* overlay */}
          <button
            type="button"
            className="absolute inset-0 bg-black/30"
            onClick={() => setArticleModalOpen(false)}
            aria-label="Fermer"
          />

          {/* modal */}
          <div className="absolute left-1/2 top-1/2 w-[min(920px,92vw)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-4xl md:text-3xl font-extrabold tracking-tight
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
          bg-clip-text text-transparent">Sélectionner un article</div>
                <div className="text-[12px] text-muted2">
                  Recherche par code ou désignation
                </div>
              </div>

              <Button
                type="button"
                onClick={() => setArticleModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-3xl border border-border text-muted2 bg-gray-50 !text-black"
                title="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>
            </div>

            <div className="p-5">
              {/* search */}
              <Input
                autoFocus
                value={articleQuery}
                onChange={(e) => setArticleQuery(e.target.value)}
                placeholder="Rechercher… (ex: ART-001 ou Filtre à huile)"
                className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-[14px] outline-none focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
              />

              {/* list */}
              <div className="mt-4 max-h-[55vh] overflow-auto rounded-2xl border border-border">
                <table className="w-full text-left text-[13px]">
                  <thead className="sticky top-0 bg-white">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3 font-semibold">Code</th>
                      <th className="px-4 py-3 font-semibold">Désignation</th>
                      <th className="px-4 py-3 font-semibold">Autre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.length === 0 ? (
                      <tr>
                        <td className="px-4 py-6 text-muted2" colSpan={3}>
                          Aucun article trouvé.
                        </td>
                      </tr>
                    ) : (
                      filteredArticles.map((a) => (
                        <tr
                          key={a.ITMREF}
                          className="border-b border-border last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">{a.ITMREF}</td>
                          <td className="px-4 py-3 text-muted2">{a.ITMDES}</td>
                          <td className="px-4 py-3 text-muted2">{a.ITMDES}</td>
                          <td className="px-4 py-2">
                            <Button
                            
                              type="button"
                              onClick={() => pickArticle(a)}
                              className="h-11 rounded-xl border border-border px-3 text-[13px] hover:bg-gray-50 hover:text-black transition"
                            >
                              Choisir
                            </Button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <Button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="h-10 rounded-2xl border border-border px-4 text-[14px] bg-gray-50 !text-black"
                >
                  Annuler
                </Button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
