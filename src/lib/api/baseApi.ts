// baseApi.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { ENDPOINTS } from "./endpoints";
import type { DevisCreatePayload } from "@/features/devis/types";

export type ApiError = {
  status?: number;
  message?: string;
};
export type ArticleRow = {
  ITMREF_0: string;
  ITMDES1_0: string;
  TSICOD_0: string | null;
  TSICOD_1: string | null;
  TSICOD_2: string | null;
  TSICOD_3: string | null;
  TSICOD_4: string | null;
  PUU_0: string | null;
};

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000",

    credentials: "include",
    prepareHeaders: (headers) => {
      return headers;
    },
  }),
  tagTypes: ["PurchaseRequests", "Claims", "Stock", "Devis"], // ✅
  endpoints: (builder) => ({
    createPurchaseRequest: builder.mutation<{ id: string }, any>({
      query: (body) => ({
        url: ENDPOINTS.purchaseRequest.create,
        method: "POST",
        body,
      }),
      invalidatesTags: ["PurchaseRequests"],
    }),

    // ✅ DEVIS
    createDevisRequest: builder.mutation<{ id: string }, DevisCreatePayload>({
      query: (body) => ({
        url: ENDPOINTS.devis.create, // ⚠️ assure-toi d’avoir ENDPOINTS.devis.create
        method: "POST",
        body,
      }),
      invalidatesTags: ["Devis"],
    }),
      getArticles: builder.query<ArticleRow[], { q?: string }>({
  query: (params) => ({
    url: ENDPOINTS.articles.list, // ✅ /api/articles
    method: "GET",
    params: params?.q ? { q: params.q } : undefined,
  }),
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
  useCreateDevisRequestMutation, // ✅
  useCreateClaimMutation,
  useGetStockQuery,
  useGetArticlesQuery,
} = baseApi;
