import { createSlice, nanoid, PayloadAction } from "@reduxjs/toolkit";
import type { PurchaseRequestForm, PurchaseRequestItem } from "./types";

type State = {
  form: PurchaseRequestForm;
};

const initialState: State = {
  form: {
    YTYPE: "",
    YCMP: "",
    REQUSR: "",
    PSHFCY: "",
    CPY: "",
    PRQDAT: "",
    YMATRICULE: "",

    items: [
      {
        id: nanoid(),
        ITMREF: "",
        ITMDES: "",
        QTYPUU: 1,
        neededDate: "",
        PUU: "UN",
        PSHFCY: ""
      },
    ],
    neededDate: "",
    QTYPUU: 1
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
        ITMREF: "",
        ITMDES: "",
        QTYPUU: 1,
        neededDate:"",
        PUU: "UN",
        PSHFCY:""
      });
    },
    removeItem(state, action: PayloadAction<string>) {
      if (state.form.items.length <= 1) return;
      state.form.items = state.form.items.filter((it) => it.id !== action.payload);
    },
    updateItem(
      state,
      action: PayloadAction<{ id: string; key: keyof PurchaseRequestItem; value: any }>
    ) {
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
