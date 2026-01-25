export type ClaimForm = {
  reference: string;
  status: "Ouvert" | "En cours" | "Cloture";
  createdAt: string;

  // Client
  clientName: string;
  clientPhone: string;
  clientAddress: string;

  // Dossier
  incidentDate: string;
  incidentPlace: string;
  description: string;

  // Reparation (placeholder)
  workshop: string;
  estimatedCost: number;

  // Facturation (placeholder)
  invoiceNumber: string;
  amountBilled: number;
};
