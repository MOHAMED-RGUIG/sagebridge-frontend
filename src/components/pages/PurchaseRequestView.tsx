"use client";

import { useMemo, useEffect ,useState } from "react";
import { useCreatePurchaseRequestMutation } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { COMPANIES , TypeDemande } from "@/features/purchaseRequest/purchaseConstante";
import { purchaseRequestActions } from "@/features/purchaseRequest/purchaseRequestSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import { useDispatch } from "react-redux";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Button from "@/components/ui/Button";
import { useGetArticlesQuery } from "@/lib/api/baseApi";

import Badge from "@/components/ui/Badge";
type MatriculeType = "NORMAL" | "AUTRE";
export default function PurchaseRequestView() {
  
const [filters, setFilters] = useState({
  ITMREF_0: "",
  ITMDES1_0: "",
  TSICOD_0: "",
  TSICOD_1: "",
  TSICOD_2: "",
  TSICOD_3: "",
  TSICOD_4: "",
  PUU_0: "",
});

  const [selected, setSelected] = useState<Record<string, any>>({});
const selectedCount = Object.keys(selected).length;
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
const authUser = useAppSelector((s) => s.auth.user);

// 1) ✅ Hook API au top level
const qLower = articleQuery.trim().toLowerCase();

const {
  data: articlesData,
  isFetching: isFetchingArticles,
  isError: isErrorArticles,
} = useGetArticlesQuery(
  { q: undefined }, // <= on récupère tout (ou TOP 200)
  { refetchOnFocus: false, refetchOnReconnect: true }
);

// 2) ✅ Normaliser la data
const articles = useMemo(() => articlesData ?? [], [articlesData]);

   {/*const filteredArticles = useMemo(() => {
  if (!qLower) return articles;

  return articles.filter((a: any) => {
    const ITMREF_0 = String(a.ITMREF_0 ?? "").toLowerCase();
    const ITMDES1_0 = String(a.ITMDES1_0 ?? "").toLowerCase();
    const TSICOD_0 = String(a.TSICOD_0 ?? "").toLowerCase();
    const TSICOD_1 = String(a.TSICOD_1 ?? "").toLowerCase();
    const TSICOD_2 = String(a.TSICOD_2 ?? "").toLowerCase();
    const TSICOD_3 = String(a.TSICOD_3 ?? "").toLowerCase();
    const TSICOD_4 = String(a.TSICOD_4 ?? "").toLowerCase();
    const PUU_0 = String(a.PUU_0 ?? "").toLowerCase();

    return (
      ITMREF_0.includes(qLower) ||
      ITMDES1_0.includes(qLower) ||
      TSICOD_0.includes(qLower) ||
      TSICOD_1.includes(qLower) ||
      TSICOD_2.includes(qLower) ||
      TSICOD_3.includes(qLower) ||
      TSICOD_4.includes(qLower) ||
      PUU_0.includes(qLower)
    );
  });
}, [qLower, articles]);

        */}
   const filteredArticles = useMemo(() => {
  return articles.filter((a: any) => {
    return (
      String(a.ITMREF_0 ?? "").toLowerCase().includes(filters.ITMREF_0.toLowerCase()) &&
      String(a.ITMDES1_0 ?? "").toLowerCase().includes(filters.ITMDES1_0.toLowerCase()) &&
      String(a.TSICOD_0 ?? "").toLowerCase().includes(filters.TSICOD_0.toLowerCase()) &&
      String(a.TSICOD_1 ?? "").toLowerCase().includes(filters.TSICOD_1.toLowerCase()) &&
      String(a.TSICOD_2 ?? "").toLowerCase().includes(filters.TSICOD_2.toLowerCase()) &&
      String(a.TSICOD_3 ?? "").toLowerCase().includes(filters.TSICOD_3.toLowerCase()) &&
      String(a.TSICOD_4 ?? "").toLowerCase().includes(filters.TSICOD_4.toLowerCase()) &&
      String(a.PUU_0 ?? "").toLowerCase().includes(filters.PUU_0.toLowerCase())
    );
  });
}, [articles, filters]);
     


// 3) ✅ Filtre frontend (exactement ton code, mais safe)

useEffect(() => {
  // ✅ remplir REQUSR automatiquement avec USR_0
  if (authUser?.usr0) {
    dispatch(purchaseRequestActions.setField({ key: "REQUSR", value: authUser.usr0 }));
  }
    if (authUser?.site) {
    dispatch(purchaseRequestActions.setField({ key: "PSHFCY", value: authUser.site }));
  }
}, [authUser?.usr0,authUser?.site, dispatch]);
  // ✅ Données articles (placeholder). Plus tard tu les remplaces par un fetch API / RTK Query



const openArticleModal = (lineId: string) => {
  setActiveLineId(lineId);
  setArticleQuery("");
   setSelected({});
  setArticleModalOpen(true);
};

const toggleSelect = (a: any) => {
  setSelected((prev) => {
    const key = String(a.ITMREF_0);
    if (prev[key]) {
      const copy = { ...prev };
      delete copy[key];
      return copy;
    }
    return { ...prev, [key]: a };
  });
};
const fillLineWithArticle = (lineId: string, a: any) => {
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "ITMREF_0", value: a.ITMREF_0 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "ITMDES1_0", value: a.ITMDES1_0 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "PUU_0", value: a.PUU_0 ?? "UN" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "TSICOD_0", value: a.TSICOD_0 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "TSICOD_1", value: a.TSICOD_1 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "TSICOD_2", value: a.TSICOD_2 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "TSICOD_3", value: a.TSICOD_3 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: lineId, key: "TSICOD_4", value: a.TSICOD_4 ?? "" }));
};

const applySelectedArticles = () => {
  if (!activeLineId) return;

  const chosen = Object.values(selected);
  if (chosen.length === 0) return;

  // 1) remplir la ligne active avec le premier article
  fillLineWithArticle(activeLineId, chosen[0]);

  // 2) ajouter le reste direct en lignes déjà remplies
  const rest = chosen.slice(1);
  if (rest.length > 0) {
    dispatch(purchaseRequestActions.appendItemsFromArticles(rest as any));
  }

  setArticleModalOpen(false);
  setActiveLineId(null);
  setSelected({});
};

  const pickArticle = (a: any) => {
  if (activeLineId == null) return;

  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "ITMREF_0", value: a.ITMREF_0 }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "ITMDES1_0", value: a.ITMDES1_0 }));

  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "PUU_0", value: a.PUU_0 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "TSICOD_0", value: a.TSICOD_0 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "TSICOD_1", value: a.TSICOD_1 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "TSICOD_2", value: a.TSICOD_2 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "TSICOD_3", value: a.TSICOD_3 ?? "" }));
  dispatch(purchaseRequestActions.updateItem({ id: activeLineId, key: "TSICOD_4", value: a.TSICOD_4 ?? "" }));

  setArticleModalOpen(false);
  setActiveLineId(null);
};



  const totalLines = form.items.length;
  const isValid = useMemo(() => {
    if (!form.REQUSR.trim()) return false;
    if (!form.PSHFCY.trim()) return false;
    if (!form.YTYPE.trim()) return false;
    if (!form.YCMPASS.trim()) return false;
    if (form.items.some((it) => !it.ITMREF_0.trim() || it.QTYPUU <= 0)) return false;
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
        key : "EXTRCPDAT",
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
        YCMPASS: form.YCMPASS,
        PSHNUM: form.PSHNUM,
        PRQDAT: form.PRQDAT || null,
        YMATRICULE: form.YMATRICULE,
        items: form.items.map((it) => ({
          ITMREF_0: it.ITMREF_0,
          ITMDES1_0: it.ITMDES1_0,
          QTYPUU: Number(it.QTYPUU),
          EXTRCPDAT: form.EXTRCPDAT || null,
          PUU_0: it.PUU_0,
          TSICOD_4: it.TSICOD_4,
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

      <Card className="!mt-8" >
        <CardHeader
          title="Voiture"
          subtitle="Informations concernant la voiture"
        /> 
        <CardContent className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          

                    <Input
            label="Site *"
            value={form.PSHFCY}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "PSHFCY", value: e.target.value }))
            }
            disabled
            placeholder="Site"
           className="
                      w-full rounded-4xl border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "
          />
          <Input
            label="Demandeur *"
            value={form.REQUSR}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "REQUSR", value: e.target.value }))
            }
            disabled
            placeholder="Nom demandeur"
           className="
                      w-full rounded-4xl border px-3 py-2
                      disabled:bg-gray-100
                      disabled:text-gray-500
                      disabled:border-gray-300
                      disabled:cursor-not-allowed
                    "
          />
<Input
            label="N demande"
            
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "PSHNUM", value: e.target.value }))}
           
            className="
                    w-full rounded-4xl border px-3 py-2
                  "/>
           

          <Input
              label="Date demande"
              type="date"
              value={form.PRQDAT}
              className="w-full rounded-4xl border px-3 py-2
              "
                onChange={(e) =>
    dispatch(
      purchaseRequestActions.setField({
        key: "PRQDAT",
        value: e.target.value,
      })
    )
  }/>

          <Select
              label= "Type demande *"
              value={form.YTYPE}
              onChange={(e) =>
                dispatch(purchaseRequestActions.setField({ key: "YTYPE", value: e.target.value }))}>
            <option value=""> -- Choisir un type de demande --</option>

          {TypeDemande.map((demande) => (
          <option key={demande.value} value={demande.value}>
            {demande.label}
          </option>
        ))}
            
          </Select>

          <Select
            label="Compagnie"
            value={form.YCMPASS}
            onChange={(e) =>
            dispatch(
            purchaseRequestActions.setField({
            key: "YCMPASS",
            value: e.target.value,
            }))}>

          <option value="">-- Choisir une compagnie --</option>
          {COMPANIES.map((company) => (
            <option key={company.value} value={company.value}>
              {company.label}
            </option>
          ))}</Select>




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
    <div className="grid w-full grid-cols-1 gap-3 mt-7 md:grid-cols-3">
       <div className="[&>span]:hidden">
    <Input value={mat1} onChange={(e) => setMat1(e.target.value)} />
  </div>

  <div className="[&>span]:hidden">
    <Input value={mat2} onChange={(e) => setMat2(e.target.value.toUpperCase())} />
  </div>

  <div className="[&>span]:hidden">
    <Input value={mat3} onChange={(e) => setMat3(e.target.value)} />
  </div>
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


        </CardContent>
        
      </Card>

        <Card className="!mt-8">
        <CardHeader
          title="Articles"
          subtitle="Ajoute une ou plusieurs lignes d’articles"
         
          right={
            <div className="flex items-center gap-2">
            <Badge tone="green">{totalLines} ligne(s)</Badge>
            <Button
              variant="secondary"
              onClick={() => dispatch(purchaseRequestActions.addItem())}
              type="button"
            >
              + Ajouter une ligne
            </Button>
            </div>
          }
        />
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-surface2 text-xs uppercase tracking-wide text-muted">
                <tr className="mb-2 text-lg font-semibold text-slate-700">
                  <th className="px-3 py-2 ">Code article*</th>
                  <th className="px-3 py-2">Désignation</th>
                  {/*<th className="px-3 py-2">Site de réception</th> */}
                  
                  <th className="px-3 py-2">Unité</th>
                  <th className="px-3 py-2">Qté *</th>
                  <th className="px-3 py-2">Date souhaitée</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/70">
                {form.items.map((it) => (
                  <tr key={it.id} className="hover:bg-surface2">
<td className="px-3 py-2">
  <div className="relative">
    <Input
      value={it.ITMREF_0}
      onChange={(e) =>
        dispatch(
          purchaseRequestActions.updateItem({
            id: it.id,
            key: "ITMREF_0",
            value: e.target.value,
          })
        )
      }
      className="h-10 w-full rounded-[14px] border border-border bg-white px-4 pr-11 text-[14px] outline-none transition placeholder:text-muted2 focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
      placeholder="Selectionner un article"
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

<Input value={it.ITMDES1_0} 
onChange={(e) => dispatch(purchaseRequestActions.updateItem({ id: it.id, key: "ITMDES1_0", value: e.target.value, }) ) } 
className="h-12 w-full rounded-[14px] border border-border  bg-gray-100
            text-gray-500
            cursor-not-allowed
            border-gray-300 px-4 text-[14px] outline-none transition 
            placeholder:text-muted2 focus:border-brand focus:ring-4 
            disabled:bg-gray-100
            disabled:text-gray-500
            disabled:border-gray-300
            disabled:cursor-not-allowed"
            placeholder="Désignation"          
            disabled/>
            </td>

                   {/* <td className="px-3 py-2">
                      <Input
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
                        className="h-12 w-full rounded-[14px] border border-border  bg-gray-100
                        text-gray-500
                        cursor-not-allowed
                        border-gray-300 px-4 text-[14px] outline-none transition 
                        placeholder:text-muted2 focus:border-brand focus:ring-4
                        disabled:bg-gray-100
                        disabled:text-gray-500
                        disabled:border-gray-300
                        disabled:cursor-not-allowed "           
                        disabled
              
                        placeholder="Site"
                           
                      />
                    </td> */} 
                  
                    <td className="px-3 py-2">
                      <Input
                        type="text"
                        value={it.PUU_0}
                        onChange={(e) =>
                          dispatch(
                            purchaseRequestActions.updateItem({
                              id: it.id,
                              key: "PUU_0",
                              value: e.target.value,
                            })
                          )
                        }
                        className="h-12 rounded-[14px] !w-24 border border-border bg-white px-4 text-[14px] outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
                      />
                    </td>
                    <td className="px-2 py-2">
                      <Input
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
                        className="h-12 rounded-[14px] !w-24 border border-border bg-white px-4 text-[14px] outline-none transition focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
                      />
                    </td>

                    <td className="px-1 py-2">
<Input  type="date"
            value={form.EXTRCPDAT}
            onChange={(e) =>
              dispatch(purchaseRequestActions.setField({ key: "EXTRCPDAT", value: e.target.value })) } />    
                    </td>


                    <td className="px-3">
                      <Button
                        variant="inverse"
                        type="button"
                        onClick={() => dispatch(purchaseRequestActions.removeItem(it.id))}
                        title="Supprimer"
                        className="h-[45px] w-11 text-xl rounded-xl"
                        
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
            <Button type="button" variant="primary" onClick={onSubmit} disabled={isLoading}>
              {isLoading ? "Envoi..." : "Créer"}
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
          <div className="absolute left-1/2 top-1/2 w-[min(1500px)] -translate-x-1/2 -translate-y-1/2 rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <div>
                <div className="text-4xl md:text-4xl font-extrabold tracking-tight
          bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600
          bg-clip-text text-transparent mt-4">Sélectionner un article</div>
               {/*  <div className="text-[12px] text-muted2">
                  Recherche un article
                </div> */}
                {isFetchingArticles ? (
  <div className="px-4 py-3 text-sm text-muted2">Chargement des articles...</div>
) : null}

{isErrorArticles ? (
  <div className="px-4 py-3 text-sm text-red-600">
    Erreur: impossible de charger les articles.
  </div>
) : null}

              </div>

              <Button
                type="button"
                variant="inverse"
                onClick={() => setArticleModalOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-3xl border border-border text-muted2 "
                title="Fermer"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                  <path d="M6 6l12 12M18 6 6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </Button>
            </div>

            <div className="p-5">
              {/* search
               <Input
                autoFocus
                value={articleQuery}
                onChange={(e) => setArticleQuery(e.target.value)}
                placeholder="Rechercher un artcile ... (ex: par  ITMREF_0 ou ITMDES1_0 ...)"
                className="h-11 w-full rounded-2xl border border-border bg-white px-4 text-[14px] outline-none focus:border-brand focus:ring-4 focus:ring-[rgba(67,24,255,0.10)]"
              />
              */}
             

              {/* list */}
              <div className="mt-4 max-h-[70vh] overflow-auto rounded-2xl border border-border">
                <table className="w-full text-left ">
                  <thead className="sticky top-0 !bg-black text-white text-[16px] font-extrabold ">
                    <tr className="border-b border-border">
                      <th className="px-4 py-3">ITMREF_0</th>
                      <th className="px-4 py-3">ITMDES1_0</th>
                      <th className="px-4 py-3 ">TSICOD_0</th>
                       <th className="px-4 py-3 ">TSICOD_1</th>
                      <th className="px-4 py-3 ">TSICOD_2</th>
                      <th className="px-4 py-3 ">TSICOD_3</th>
                       <th className="px-4 py-3 ">TSICOD_4</th>
                      <th className="px-4 py-3 ">PUU_0</th>
                     <th className="px-4 py-3 ">Sel</th>

                    </tr>
                    <tr className="border-b border-border bg-white text-black">
  <th className="px-4">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.ITMREF_0}
      onChange={(e) => setFilters({ ...filters, ITMREF_0: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.ITMDES1_0}
      onChange={(e) => setFilters({ ...filters, ITMDES1_0: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.TSICOD_0}
      onChange={(e) => setFilters({ ...filters, TSICOD_0: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.TSICOD_1}
      onChange={(e) => setFilters({ ...filters, TSICOD_1: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.TSICOD_2}
      onChange={(e) => setFilters({ ...filters, TSICOD_2: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.TSICOD_3}
      onChange={(e) => setFilters({ ...filters, TSICOD_3: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.TSICOD_4}
      onChange={(e) => setFilters({ ...filters, TSICOD_4: e.target.value })}
    />
  </th>

  <th className="px-4 py-2">
    <input
      className="w-full text-sm border border-border rounded px-2 py-1 outline-none"
      value={filters.PUU_0}
      onChange={(e) => setFilters({ ...filters, PUU_0: e.target.value })}
    />
  </th>

  <th></th>
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
                          key={a.ITMREF_0}
                          className="border-b border-border last:border-b-0 hover:bg-gray-50"
                        >
                          <td className="px-4 py-3 font-medium">{a.ITMREF_0}</td>
                          <td className="px-4 py-3 text-muted2">{a.ITMDES1_0}</td>
                          <td className="px-4 py-3 text-muted2">{a.TSICOD_0}</td>
                          <td className="px-4 py-3 font-medium">{a.TSICOD_1}</td>
                          <td className="px-4 py-3 font-medium">{a.TSICOD_2}</td>
                          <td className="px-4 py-3 font-medium">{a.TSICOD_3}</td>
                          <td className="px-4 py-3 font-medium">{a.TSICOD_4}</td>
                          <td className="px-4 py-3 font-medium">{a.PUU_0}</td>
                      <td className="px-4 py-2 flex items-center gap-2">
  <input
    type="checkbox"
    checked={Boolean(selected[String(a.ITMREF_0)])}
    onChange={() => toggleSelect(a)}
    className="h-4 w-4"
  />

  <Button
    variant="secondary"
    type="button"
    onClick={() => pickArticle(a)}
    className="h-9 rounded-xl border border-border px-3 text-[13px] hover:bg-gray-50 hover:text-black transition"
  >
    +
  </Button>
</td>

                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

  <div className="mt-4 flex justify-end gap-2">
  <Button
    type="button"
    variant="secondary"
    onClick={applySelectedArticles}
    disabled={selectedCount === 0}
    className="h-10 rounded-2xl border border-border px-4 text-[14px]"
  >
    Ajouter sélection ({selectedCount})
  </Button>

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
