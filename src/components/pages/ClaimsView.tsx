"use client";

import { useMemo, useState } from "react";
import { useCreateClaimMutation } from "@/lib/api/baseApi";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { claimsActions } from "@/features/claims/claimsSlice";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import Tabs from "@/components/ui/Tabs";
import Button from "@/components/ui/Button";
import Badge from "@/components/ui/Badge";

import StepperTabs from "@/components/ui/StepperTabs";

const steps = [
  { id: "info-generale", title: "Generale", subtitle: "Entête" },
  { id: "infos-dossier", title: "Dossier", subtitle: "Assuré & véhicule" },
  { id: "reparation", title: "Réparation", subtitle: "Détails" },
  { id: "photos", title: "Documents", subtitle: "Photos & pièces" },
  { id: "facturation", title: "Facturation", subtitle: "Tiers & articles" },
];

type ClaimTab = "general" | "dossier" | "reparation" | "documents" | "facturation";

const TABS: Array<{ key: ClaimTab; label: string }> = [
  { key: "general", label: "Information générale" },
  { key: "dossier", label: "Informations dossier" },
  { key: "reparation", label: "Réparation" },
  { key: "documents", label: "Documents" },
  { key: "facturation", label: "Facturation" },
];

function SectionTitle({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-3">
      <div className="text-sm font-semibold tracking-tight">{title}</div>
      {subtitle ? <div className="text-xs text-muted">{subtitle}</div> : null}
    </div>
  );
}

export default function ClaimsView() {
  const dispatch = useAppDispatch();
  const form = useAppSelector((s) => s.claims.form);

  const [tab, setTab] = useState<ClaimTab>("general");
  const [localFiles, setLocalFiles] = useState<File[]>([]);

  const [createClaim, createState] = useCreateClaimMutation();

  const canSubmit = useMemo(() => {
    return form.reference.trim() && form.clientName.trim();
  }, [form.reference, form.clientName]);

  async function onSubmit() {
    if (!canSubmit) return;
    try {
      await createClaim({ ...form }).unwrap();
      alert("Dossier sinistre envoyé (API placeholder). Branche le backend pour enregistrer en DB.");
    } catch {
      alert("Erreur API (placeholder). Vérifie NEXT_PUBLIC_API_BASE_URL / backend.");
    }
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader
          title=""
          subtitle=""
          right={
            <div className="flex items-center gap-2">
              <Badge tone={canSubmit ? "green" : "amber"}>
                {canSubmit ? "Prêt à soumettre" : "Champs requis"}
              </Badge>
             {/* <Button
                variant="secondary"
                onClick={() => dispatch(claimsActions.reset())}
              >
                Réinitialiser
              </Button>*/} 
              <Button disabled={!canSubmit || createState.isLoading} onClick={onSubmit}>
                {createState.isLoading ? "Envoi..." : "Créer"}
              </Button>
            </div>
          }
        />
        <CardContent className="space-y-4">
          
          <StepperTabs
  steps={steps}
  activeId={
    tab === "general"
      ? "info-generale"
      : tab === "dossier"
      ? "infos-dossier"
      : tab === "reparation"
      ? "reparation"
      : tab === "documents"
      ? "photos"
      : "facturation"
  }
  onChange={(id) => {
    if (id === "info-generale") setTab("general");
    if (id === "infos-dossier") setTab("dossier");
    if (id === "reparation") setTab("reparation");
    if (id === "photos") setTab("documents");
    if (id === "facturation") setTab("facturation");
  }}
/>

          {tab === "general" ? (
            <div className="space-y-4">
              <SectionTitle
                title="Informations générales"
                subtitle="Référence, statut, date création (placeholders)"
              />
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="Référence *"
                  placeholder="Ex: DS-2026-001"
                  value={form.reference}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "reference", value: e.target.value }))
                  }
                />
                <Select
                  label="Statut"
                  value={form.status}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "status", value: e.target.value }))
                  }
                >
                  <option value="Ouvert">Ouvert</option>
                  <option value="En cours">En cours</option>
                  <option value="Cloture">Cloturé</option>
                </Select>
                <Input
                  label="Date création"
                  type="date"
                  value={form.createdAt}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "createdAt", value: e.target.value }))
                  }
                />
              </div>

              <SectionTitle title="Client" subtitle="Identité & coordonnées" />
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="Nom client *"
                  placeholder="Nom & prénom"
                  value={form.clientName}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "clientName", value: e.target.value }))
                  }
                />
                <Input
                  label="Téléphone"
                  placeholder="+212..."
                  value={form.clientPhone}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "clientPhone", value: e.target.value }))
                  }
                />
                <Input
                  label="Adresse"
                  placeholder="Ville, quartier..."
                  value={form.clientAddress}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "clientAddress", value: e.target.value }))
                  }
                />
              </div>
            </div>
          ) : null}

          {tab === "dossier" ? (
            <div className="space-y-4">
              <SectionTitle title="Informations dossier" subtitle="Date, lieu, description" />
              <div className="grid gap-3 md:grid-cols-3">
                <Input
                  label="Date incident"
                  type="date"
                  value={form.incidentDate}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "incidentDate", value: e.target.value }))
                  }
                />
                <Input
                  label="Lieu"
                  placeholder="Ex: Casablanca"
                  value={form.incidentPlace}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "incidentPlace", value: e.target.value }))
                  }
                />
                <Input
                  label="Résumé"
                  placeholder="Ex: choc arrière..."
                  value={form.description}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "description", value: e.target.value }))
                  }
                />
              </div>
              <div className="rounded-3xl border border-border/70 bg-surface2 p-4 text-sm text-text/80">
                Ici tu peux ajouter plus de champs selon ton métier (véhicule, police, expert, etc.).
              </div>
            </div>
          ) : null}

          {tab === "reparation" ? (
            <div className="space-y-4">
              <SectionTitle title="Réparation" subtitle="Atelier & estimation (placeholder)" />
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="Atelier"
                  placeholder="Nom de l’atelier"
                  value={form.workshop}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "workshop", value: e.target.value }))
                  }
                />
                <Input
                  label="Coût estimé"
                  type="number"
                  min={0}
                  value={form.estimatedCost}
                  onChange={(e) =>
                    dispatch(
                      claimsActions.setField({ key: "estimatedCost", value: Number(e.target.value) })
                    )
                  }
                />
              </div>
              <div className="rounded-3xl border border-border/70 bg-white/70 p-4 text-sm text-text/80 backdrop-blur">
                Branche plus tard une table de pièces, main d’œuvre, validation, etc.
              </div>
            </div>
          ) : null}

          {tab === "documents" ? (
            <div className="space-y-4">
              <SectionTitle
                title="Documents"
                subtitle="Upload local (placeholder). Le backend gérera stockage & lien au dossier."
              />
              <div className="rounded-3xl border border-dashed border-border bg-white/50 p-6 backdrop-blur">
                <input
                  type="file"
                  multiple
                  onChange={(e) => setLocalFiles(Array.from(e.target.files ?? []))}
                />
                <div className="mt-3 text-xs text-muted">
                  Endpoint prévu: <span className="font-mono">POST /api/claims/:id/documents</span>
                </div>
              </div>

              {localFiles.length ? (
                <div className="overflow-hidden rounded-3xl border border-border/70 bg-white/70 backdrop-blur">
                  <div className="border-b border-border/60 px-4 py-3 text-sm font-semibold">
                    Fichiers sélectionnés
                  </div>
                  <ul className="divide-y divide-border/70">
                    {localFiles.map((f) => (
                      <li key={f.name} className="flex items-center justify-between px-4 py-3 text-sm">
                        <span className="truncate">{f.name}</span>
                        <span className="text-xs text-muted">{Math.round(f.size / 1024)} KB</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ) : null}
            </div>
          ) : null}

          {tab === "facturation" ? (
            <div className="space-y-4">
              <SectionTitle title="Facturation" subtitle="Numéro facture & montant (placeholder)" />
              <div className="grid gap-3 md:grid-cols-2">
                <Input
                  label="N° facture"
                  placeholder="Ex: FAC-2026-045"
                  value={form.invoiceNumber}
                  onChange={(e) =>
                    dispatch(claimsActions.setField({ key: "invoiceNumber", value: e.target.value }))
                  }
                />
                <Input
                  label="Montant"
                  type="number"
                  min={0}
                  value={form.amountBilled}
               
                  onChange={(e) =>
                    dispatch(
                      claimsActions.setField({ key: "amountBilled", value: Number(e.target.value) })
                    )
                  }
                />
              </div>
              <div className="rounded-3xl border border-border/70 bg-surface2 p-4 text-sm text-text/80">
                Quand le backend sera prêt, tu peux générer PDF, suivi paiement, etc.
              </div>
            </div>
          ) : null}

          <div className="flex flex-col gap-2 rounded-3xl border border-border/70 bg-white/70 p-4 text-sm text-text/80 backdrop-blur md:flex-row md:items-center md:justify-between">
            {/*<div>
              <div className="font-semibold">API placeholders</div>
              <div className="text-xs text-muted">
                POST <span className="font-mono">/api/claims</span> • POST <span className="font-mono">/api/claims/:id/documents</span>
              </div>
            </div>*/}
            <Button variant="secondary" onClick={() => setTab("general")}>Revenir au début</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
