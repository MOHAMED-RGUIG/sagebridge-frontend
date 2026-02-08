import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { PurchaseRequestForm, PurchaseRequestItem } from "./types";

// ✅ ajoute ce type local (simple)
type ArticleLike = {
  ITMREF_0?: string;
  ITMDES1_0?: string;
  QTYPUU?: number;
  EXTRCPDAT?: string;
  PUU_0?: string;
  TSICOD_0?: string;
  TSICOD_1?: string;
  TSICOD_2?: string;
  TSICOD_3?: string;
  TSICOD_4?: string;
};

type State = {
  form: PurchaseRequestForm;
};

const initialState: State = {
  form: {
    YTYPE: "",
    YCMPASS: "",
    REQUSR: "",
    PSHFCY: "",
    PSHNUM: "",
    PRQDAT: "",
    YMATRICULE: "",

    items: [
      {
        id: nanoid(),
        ITMREF_0: "",
        ITMDES1_0: "",
        QTYPUU: 1,
        EXTRCPDAT: "",
        PUU_0: "UN",
        TSICOD_0: "",
        TSICOD_1: "",
        TSICOD_2: "",
        TSICOD_3: "",
        TSICOD_4: "",
      },
    ],
    EXTRCPDAT: "",
    QTYPUU: 1,
  },
};

const slice = createSlice({
  name: "purchaseRequest",
  initialState,
  reducers: {
    setField(state, action: PayloadAction<{ key: keyof PurchaseRequestForm; value: any }>) {
      (state.form as any)[action.payload.key] = action.payload.value;
    },

    addItem(state) {
      state.form.items.push({
        id: nanoid(),
        ITMREF_0: "",
        ITMDES1_0: "",
        QTYPUU: 1,
        EXTRCPDAT: "",
        PUU_0: "UN",
        TSICOD_0: "",
        TSICOD_1: "",
        TSICOD_2: "",
        TSICOD_3: "",
        TSICOD_4: "",
      });
    },

    // ✅ NEW: ajoute plusieurs lignes directement remplies (zéro ligne vide)
    appendItemsFromArticles(state, action: PayloadAction<ArticleLike[]>) {
      const arr = action.payload ?? [];
      for (const a of arr) {
        state.form.items.push({
          id: nanoid(),
          ITMREF_0: String(a.ITMREF_0 ?? ""),
          ITMDES1_0: String(a.ITMDES1_0 ?? ""),
          QTYPUU: Number(a.QTYPUU ?? 1),
          EXTRCPDAT: String(a.EXTRCPDAT ?? ""),
          PUU_0: String(a.PUU_0 ?? "UN"),
          TSICOD_0: String(a.TSICOD_0 ?? ""),
          TSICOD_1: String(a.TSICOD_1 ?? ""),
          TSICOD_2: String(a.TSICOD_2 ?? ""),
          TSICOD_3: String(a.TSICOD_3 ?? ""),
          TSICOD_4: String(a.TSICOD_4 ?? ""),
        });
      }
    },

    removeItem(state, action: PayloadAction<string>) {
      if (state.form.items.length <= 1) return;
      state.form.items = state.form.items.filter((it) => it.id !== action.payload);
    },

    updateItem(state, action: PayloadAction<{ id: string; key: keyof PurchaseRequestItem; value: any }>) {
      const it = state.form.items.find((x) => x.id === action.payload.id);
      if (!it) return;
      (it as any)[action.payload.key] = action.payload.value;
    },

    reset(state) {
      state.form = initialState.form;
    },
  },
});

export const purchaseRequestActions = slice.actions;
export default slice.reducer;
