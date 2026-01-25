"use client";

import { useMemo, useEffect ,useState } from "react";
import { useCreatePurchaseRequestMutation } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { purchaseRequestActions } from "@/features/purchaseRequest/purchaseRequestSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDispatch } from "react-redux";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";
type MatriculeType = "NORMAL" | "AUTRE";
export default function PurchaseRequestView() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.purchaseRequest.form);
  const [createPurchaseRequest, { isLoading }] = useCreatePurchaseRequestMutation();
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
      purchaseRequestActions.updateItem({
        id: activeLineId,
        key: "ITMREF",
        value: a.ITMREF,
      })
    );
    dispatch(
      purchaseRequestActions.updateItem({
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
      purchaseRequestActions.setField({
        key: "PRQDAT",
        value: today,
       
      })
    );
    dispatch(
      purchaseRequestActions.setField({
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
        })),
      };

      // Appelle l’API (placeholder)
      await createPurchaseRequest(payload).unwrap();
      dispatch(purchaseRequestActions.reset());
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

  dispatch(purchaseRequestActions.setField({ key: "YMATRICULE", value }));
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
    dispatch(purchaseRequestActions.setField({ key: "YMATRICULE", value: "" }));
  }
}, [matType, dispatch]);

const matriculeDisabled = matType === "NORMAL";
  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-lg font-semibold">Formulaire de demande d’achat</h1>
          <p className="text-sm text-muted">Insertion • UI moderne • prête backend</p>
        </div>
        <div className="flex items-center gap-2">
          <Badge tone={isValid ? "green" : "amber"}>{isValid ? "Prêt" : "Incomplet"}</Badge>
          <Badge tone="blue">{totalLines} ligne(s)</Badge>
        </div>
      </div>

      {toast ? (
        <div className="rounded-3xl border border-border/70 bg-white/70 px-4 py-3 text-sm shadow-sm backdrop-blur">
          {toast}
        </div>
      ) : null}

      <Card>
        <CardHeader
          title=""
          subtitle=""
        />
        <CardContent className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-4">
          
        <Input
            label="Société"
            value={'GAE'}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "CPY", value: e.target.value }))
            }
            
            disabled
            className="
                    w-full rounded-md border px-3 py-2
                    disabled:bg-gray-100
                    disabled:text-gray-500
                    disabled:border-gray-300
                    disabled:cursor-not-allowed
                  "
          />
          
          <Select
            label= "Site *"
            value={form.PSHFCY}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "PSHFCY", value: e.target.value }))
            }
            disabled
         className="
                      w-full rounded-md border px-3 py-2
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
            label="Demandeur *"
            value={form.REQUSR}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "REQUSR", value: e.target.value }))
            }
            disabled
            placeholder="Nom & prénom"
           className="
                      w-full rounded-md border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "
          />
          <Input
              label="Date d'achat"
              type="date"
              value={form.PRQDAT}
              disabled
              className="
                      w-full rounded-md border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "/>



        <Select
            label= "Type d'achat *"
            value={form.YTYPE}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "YTYPE", value: e.target.value }))
            }          
          >
            <option value=""> Métier – Local – En masse</option>
            <option value="">Informatique</option>
            <option value="">Achat Métier Ponctuel</option>
            <option value="">Technique</option>
            <option value="">Moyens Généraux</option>
            <option value="">Aménagement</option>
            <option value="">Métier – Import – En Masse</option>
            
          </Select>

             <Select
            label="Compagnie"
            value={form.YCMP}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "YCMP", value: e.target.value }))
            }            >
            <option value=""> AGE EUROPE</option>
            <option value="">ALD AUTOMOTIVE</option>
            <option value="">ALLIANZ</option>
            <option value="">ARVAL MAROC</option>
            <option value="">ATLANTA SANAD</option>
            <option value="">AXA</option>
            <option value="">CAISSE COMPTOIRE</option>
            <option value="">CAISSE FLOTTE</option>
            <option value="">CHAABI LLD</option>
            <option value="">COPAG</option>
            <option value="">LOCAMA</option>
            <option value="">LOCASOM</option>
            <option value="">MAMDA - MCMA</option>
            <option value="">MATU</option>
            <option value="">PETIT FORESTIER MAROC</option>
            <option value="">RMA</option>
            <option value="">Sanlam Maroc</option>
            <option value="">TIMLOG</option>
            <option value="">VerAuto</option>
            <option value="">WAFA ASSURANCES</option>
            <option value="">WAFA CASSE</option>
            <option value="">WAFA LLD</option>    

         </Select>


         <div className="w-full space-y-3 mt-3">
  {/* SELECT TYPE */}
  <div className="w-full">
    <label className="mb-1 block text-sm font-medium">Type matricule</label>
    <Select
      className="h-10 w-full rounded-md border border-border bg-white px-3"
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
          purchaseRequestActions.setField({
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
          title="Articles"
          subtitle="Ajoute une ou plusieurs lignes d’articles"
          right={
            <Button
              variant="secondary"
              onClick={() => dispatch(purchaseRequestActions.addItem())}
              type="button"
            >
              + Ajouter une ligne
            </Button>
          }
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface2 text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-3 py-2">Code article*</th>
                  <th className="px-3 py-2">Désignation</th>
                  <th className="px-3 py-2">Site de réception</th>
                  <th className="px-3 py-2">Unité d'achat</th>
                  <th className="px-5 py-2">Qté *</th>
                  <th className="px-3 py-2">Date souhaitée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {form.items.map((it) => (
                  <tr key={it.id} className="hover:bg-surface2">
<td className="px-3 py-2">
  <div className="relative">
    <input
      value={it.ITMREF}
      onChange={(e) =>
        dispatch(
          purchaseRequestActions.updateItem({
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
      {/* loupe */}
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
<td className="px-3 py-2"> 
<input value={it.ITMDES} onChange={(e) => dispatch( purchaseRequestActions.updateItem({ id: it.id, key: "ITMDES", value: e.target.value, }) ) } className="h-10 w-full rounded-[14px] border border-border  bg-gray-100
            text-gray-500
            cursor-not-allowed
            border-gray-300 px-4 text-[14px] outline-none transition placeholder:text-muted2 focus:border-brand focus:ring-4 " placeholder="Désignation"          disabled
         /> </td>

                    <td className="px-3 py-2">
                      <input
                        value={it.PSHFCY}
                        onChange={(e) =>
                          dispatch(
                            purchaseRequestActions.updateItem({
                              id: it.id,
                              key: "PSHFCY",
                              value: e.target.value,
                            })
                          )
                        }
 className="h-10 w-full rounded-[14px] border border-border  bg-gray-100
            text-gray-500
            cursor-not-allowed
            border-gray-300 px-4 text-[14px] outline-none transition placeholder:text-muted2 focus:border-brand focus:ring-4 "           disabled
   
                        placeholder="Site"
                           
                      />
                    </td>
                    <td className="px-3 py-2">
                      <select
                        value={it.PUU}
                        onChange={(e) =>
                          dispatch(
                            purchaseRequestActions.updateItem({
                              id: it.id,
                              key: "PUU",
                              value: e.target.value,
                            })
                          )
                        }
                        className="h-10 rounded-[14px] border border-border bg-white px-4 text-[14px] outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
                      >
                        <option value="UN">UN</option>
                        <option value="PCS">PCS</option>
                        <option value="KG">KG</option>
                        <option value="L">L</option>
                      </select>
                    </td>
                    <td className="px-2 py-2">
                      <input
                        type="number"
                        min={1}
                        value={it.QTYPUU}
                        onChange={(e) =>
                          dispatch(
                            purchaseRequestActions.updateItem({
                              id: it.id,
                              key: "QTYPUU",
                              value: Number(e.target.value),
                            })
                          )
                        }
                        className="h-10 w-16 rounded-[14px] border border-border bg-white px-4 text-[14px] outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
                      />
                    </td>

                    <td className="px-1 py-2">
                    <Input
            
            type="date"
            value={form.neededDate}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "neededDate", value: e.target.value }))
            }
          />    
                    </td>


                    <td className="px-3 py-2 text-right">
                      <Button
                        variant="ghost"
                        type="button"
                        onClick={() => dispatch(purchaseRequestActions.removeItem(it.id))}
                        title="Supprimer"
                      >
                        🗑
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-center md:justify-end">
            <Button
              variant="secondary"
              type="button"
              onClick={() => dispatch(purchaseRequestActions.reset())}
            >
              Réinitialiser
            </Button>
            <Button type="button" onClick={onSubmit} disabled={isLoading}>
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
                <div className="text-[16px] font-semibold">Sélectionner un article</div>
                <div className="text-[12px] text-muted2">
                  Recherche par code ou désignation
                </div>
              </div>

              <button
                type="button"
                onClick={() => setArticleModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-xl border border-border text-muted2 hover:bg-gray-50"
                title="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <div className="p-5">
              {/* search */}
              <input
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
                            <button
                              type="button"
                              onClick={() => pickArticle(a)}
                              className="h-9 rounded-xl border border-border bg-white px-3 text-[13px] hover:bg-gray-50"
                            >
                              Choisir
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setArticleModalOpen(false)}
                  className="h-10 rounded-2xl border border-border bg-white px-4 text-[14px] hover:bg-gray-50"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}

    </div>
  );
}
