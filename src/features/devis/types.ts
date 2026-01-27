// src/features/devis/types.ts

export type MatriculeType = "NORMAL" | "AUTRE";

export type DevisLine = {
  id: string;

  ITMREF: string;
  ITMDES: string;

  // site (si tu veux le garder par ligne)
  PSHFCY: string;

  // unité (UV)
  PUU: "UN" | "PCS" | "KG" | "L" | string;

  QTYPUU: number;

  // ✅ PRIX
  PBRUT: number;   // prix brut unitaire
  REMISE: number;  // remise en % (0..100)
  PNET: number;    // prix net unitaire (calculé)
};

export type DevisForm = {
  // En-tête (repris de ton code)
  REQUSR: string;
  PSHFCY: string;
  YTYPE: string;
  YCMP: string;

  CPY: string;
  PRQDAT: string;
  neededDate: string;

  YMATRICULE: string;

  items: DevisLine[];
};

export type DevisCreatePayload = {
  REQUSR: string;
  PSHFCY: string;
  YTYPE: string;
  YCMP: string;

  CPY: string;
  PRQDAT: string | null;
  YMATRICULE: string;

  items: Array<{
    ITMREF: string;
    ITMDES: string;
    QTYPUU: number;
    neededDate: string | null;
    PUU: string;

    PBRUT: number;
    REMISE: number;
    PNET: number;
  }>;
};
