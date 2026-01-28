// src/features/devis/devisSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { DevisForm, DevisLine } from "./types";

const computeNet = (brut: number, remise: number) => {
  const b = Number.isFinite(brut) ? brut : 0;
  const r = Number.isFinite(remise) ? remise : 0;
  const safeR = Math.min(100, Math.max(0, r));
  return +(b * (1 - safeR / 100)).toFixed(2);
};

const newLine = (): DevisLine => ({
  id: typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : String(Date.now()),
  INDTL: "L",
  ITMREF: "",
  ITMDES: "",
  PSHFCY: "",

  PUU: "UN",
  QTYPUU: 1,

  PBRUT: 0,
  REMISE: 0,
  PNET: 0,
});

const initialState: { form: DevisForm } = {
  form: {
    
    INDT : 'E',
    PSHFCY: "SIG",
    TYPDV:'SQN',
    NDV:"",
    NCLT:"",
    CLT:"",
    PRQDAT: '' ,
    REF: '' ,
    DEV: 'MAD',
    KM:'',
    YMATRICULE: "",
    neededDate: "",
    REFS: "",


    

    

    items: [newLine()],
  },
};

export const devisSlice = createSlice({
  name: "devis",
  initialState,
  reducers: {
    setField: (state, action: PayloadAction<{ key: keyof DevisForm; value: any }>) => {
      (state.form as any)[action.payload.key] = action.payload.value;
    },

    addItem: (state) => {
      state.form.items.push(newLine());
    },

    removeItem: (state, action: PayloadAction<string>) => {
      state.form.items = state.form.items.filter((x) => x.id !== action.payload);
      if (state.form.items.length === 0) state.form.items.push(newLine());
    },

    updateItem: (
      state,
      action: PayloadAction<{ id: string; key: keyof DevisLine; value: any }>
    ) => {
      const it = state.form.items.find((x) => x.id === action.payload.id);
      if (!it) return;

      (it as any)[action.payload.key] = action.payload.value;

      // ✅ auto calc net
      if (action.payload.key === "PBRUT" || action.payload.key === "REMISE") {
        it.PNET = computeNet(Number(it.PBRUT), Number(it.REMISE));
      }
    },

    reset: () => initialState,
  },
});

export const devisRequestActions = devisSlice.actions;
export default devisSlice.reducer;
