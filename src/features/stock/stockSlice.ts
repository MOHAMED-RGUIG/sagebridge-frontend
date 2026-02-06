import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import type { StockQuery } from "./types";

type State = {
  query: StockQuery;
};

const initialState: State = {
  query: { q: "",   date: "",
  dateFrom: "",
  dateTo: "",site: "SIG" },
};

const slice = createSlice({
  name: "stock",
  initialState,
  reducers: {
    setQuery(state, action: PayloadAction<Partial<StockQuery>>) {
      state.query = { ...state.query, ...action.payload };
    },
  },
});

export const stockActions = slice.actions;
export default slice.reducer;
