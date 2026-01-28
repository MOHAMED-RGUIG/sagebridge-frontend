// src/features/devis/types.ts

export type MatriculeType = "NORMAL" | "AUTRE";

export type DevisLine = {
  // Details 
  id: string;
  INDTL:string;
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
  INDT : string;
  PSHFCY: string;
  TYPDV:string;
  NDV:string;
  NCLT:string;
  CLT:string;
  PRQDAT: string;
  REF: string;
  DEV: string;
  KM: string;
  YMATRICULE: string;
  neededDate: string;
  REFS: string;

  
 

  

  items: DevisLine[];
};

export type DevisCreatePayload = {
  
  INDT : string;
  PSHFCY: string;
  TYPDV:string;
  NDV:string;
  NCLT:string;
  CLT:string;
  PRQDAT: string | null;
  REF: string;
  DEV: string;
  KM: string;
  YMATRICULE: string;
  neededDate: string | null;
  REFS: string;

  
  

  items: Array<{
    INDTL : string;
    ITMREF: string;
    ITMDES: string;
    QTYPUU: number;
    
    PUU: string;

    PBRUT: number;
    REMISE: number;
    PNET: number;
  }>;
};
