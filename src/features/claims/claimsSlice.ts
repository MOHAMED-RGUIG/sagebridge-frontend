import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { ClaimForm } from "./types";

type State = {
  form: ClaimForm;
};

const initialState: State = {
  form: {
    reference: "",
    status: "Ouvert",
    createdAt: "",

    clientName: "",
    clientPhone: "",
    clientAddress: "",

    incidentDate: "",
    incidentPlace: "",
    description: "",

    workshop: "",
    estimatedCost: 0,

    invoiceNumber: "",
    amountBilled: 0,
  },
};

const slice = createSlice({
  name: "claims",
  initialState,
  reducers: {
    setField(state, action: PayloadAction<{ key: keyof ClaimForm; value: any }>) {
      (state.form as any)[action.payload.key] = action.payload.value;
    },
    reset(state) {
      state.form = initialState.form;
    },
  },
});

export const claimsActions = slice.actions;
export default slice.reducer;
