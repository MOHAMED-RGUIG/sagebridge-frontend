import { configureStore } from "@reduxjs/toolkit";
import purchaseRequestReducer from "@/features/purchaseRequest/purchaseRequestSlice";
import claimsReducer from "@/features/claims/claimsSlice";
import stockReducer from "@/features/stock/stockSlice";
import { baseApi } from "@/lib/api/baseApi";

export const store = configureStore({
  reducer: {
    purchaseRequest: purchaseRequestReducer,
    claims: claimsReducer,
    stock: stockReducer,
    [baseApi.reducerPath]: baseApi.reducer,
  },
  middleware: (getDefault) => getDefault().concat(baseApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
