import { configureStore } from "@reduxjs/toolkit";
import purchaseRequestReducer from "@/features/purchaseRequest/purchaseRequestSlice";
import claimsReducer from "@/features/claims/claimsSlice";
import stockReducer from "@/features/stock/stockSlice";
import devisReducer from "@/features/devis/devisSlice";
import { baseApi } from "@/lib/api/baseApi";

export const store = configureStore({
  reducer: {
    purchaseRequest: purchaseRequestReducer,
    claims: claimsReducer,
    stock: stockReducer,
    devis:devisReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
