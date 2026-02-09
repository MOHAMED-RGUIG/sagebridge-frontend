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
// types
export type PurchaseRequestListRow = {
  PSHNUM_0: string;
  CREUSR_0: string;
  YTYPE_0: string | null;
  EXTORDDAT_0: string | null;
  YCMPASS_0: string | null;
  YMATRICULE_0: string | null;
  QTYPUU_0: number | null;
  PSHFCY_0: string | null;
};

export type PurchaseRequestsListResponse = {
  items: PurchaseRequestListRow[];
  total: number;
  page: number;
  pageSize: number;
};

export type PurchaseRequestsListParams = Partial<{
  page: number;
  pageSize: number;

  PSHNUM_0: string;
  CREUSR_0: string;
  YTYPE_0: string;
  YCMPASS_0: string;
  YMATRICULE_0: string;
  PSHFCY_0: string;

  dateFrom: string; // YYYY-MM-DD
  dateTo: string;   // YYYY-MM-DD
}>;

export type PurchaseRequestDetailsLine = {
  PSHNUM_0: string;
  PSHFCY_0: string | null;
  QTYPUU_0: number | null;
  EXTORDDAT_0: string | null;
};

export type PurchaseRequestDetailsResponse = {
  header: {
    PSHNUM_0: string;
    CREUSR_0: string;
    YTYPE_0: string | null;
    EXTORDDAT_0: string | null;
    YCMPASS_0: string | null;
    YMATRICULE_0: string | null;
  };
  lines: PurchaseRequestDetailsLine[];
};
export type PurchaseRequestLineDTO = {
  ITMREF_0: string;
  ITMDES1_0?: string | null;
  QTYPUU_0: number;
  EXTORDDAT_0?: string | null;
  PSHFCY_0?: string | null;
};

export type PurchaseRequestHeaderDTO = {
  PSHNUM_0: string;
  CREUSR_0: string;
  PSHFCY_0: string;
  YTYPE_0: string | null;
  YCMPASS_0: string | null;
  YMATRICULE_0: string | null;
  PRQDAT_0?: string | null;
  EXTORDDAT_0?: string | null;
};

export type PurchaseRequestDetailsDTO = {
  header: PurchaseRequestHeaderDTO;
  lines: PurchaseRequestLineDTO[];
};

export type UpdatePurchaseRequestBody = {
  // header (ce que ton form envoie)
  REQUSR: string;
  PSHFCY: string;
  YTYPE_0: string;
  YCMPASS: string;
  PRQDAT?: string | null;
  YMATRICULE?: string | null;
  EXTRCPDAT?: string | null;

  items: Array<{
    ITMREF_0: string;
    ITMDES1_0?: string | null;
    QTYPUU: number;
    EXTRCPDAT?: string | null;
    PUU_0?: string | null;
    TSICOD_4?: string | null;
  }>;
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

    // endpoints
getPurchaseRequests: builder.query<PurchaseRequestsListResponse, PurchaseRequestsListParams>({
  query: (params) => {
    const qs = new URLSearchParams();

    Object.entries(params || {}).forEach(([k, v]) => {
      if (v === undefined || v === null) return;
      const s = String(v).trim();
      if (!s) return;
      qs.set(k, s);
    });

    const q = qs.toString();
    return {
      url: `/api/purchase-request${q ? `?${q}` : ""}`,
      method: "GET",
    };
  },
}),

getPurchaseRequestByNum: builder.query<PurchaseRequestDetailsDTO, string>({
  query: (pshnum_0) => ({
    url: `/api/purchase-request/${encodeURIComponent(pshnum_0)}`,
    method: "GET",
  }),
}),

updatePurchaseRequest: builder.mutation<{ ok: true }, { pshnum_0: string; body: UpdatePurchaseRequestBody }>({
  query: ({ pshnum_0, body }) => ({
    url: `/api/purchase-request/${encodeURIComponent(pshnum_0)}`,
    method: "PUT",
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
  useGetPurchaseRequestsQuery,
  useGetPurchaseRequestByNumQuery,
  
  useUpdatePurchaseRequestMutation,
} = baseApi;
 





