import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "./endpoints";

export type ApiError = {
  status?: number;
  message?: string;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",
    prepareHeaders: (headers) => {
      // Placeholder Auth: à compléter plus tard (JWT / cookie session)
      // const token = ...
      // if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["PurchaseRequests", "Claims", "Stock"],
  endpoints: (builder) => ({
    createPurchaseRequest: builder.mutation<{ id: string }, any>({
      query: (body) => ({
        url: ENDPOINTS.purchaseRequest.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseRequests"],
    }),

    createClaim: builder.mutation<{ id: string }, any>({
      query: (body) => ({
        url: ENDPOINTS.claims.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Claims"],
    }),

    getStock: builder.query<any[], { q?: string; site?: string }>({
      query: (params) => ({
        url: ENDPOINTS.stock.list,
        method: "GET",
        params,
      }),
      providesTags: ["Stock"],
    }),
  }),
});

export const {
  useCreatePurchaseRequestMutation,
  useCreateClaimMutation,
  useGetStockQuery,
} = baseApi;
