export const ENDPOINTS = {
  purchaseRequest: {
    create: "/api/purchase-request",
    list: "/api/purchase-request",
  },
  claims: {
    create: "/api/claims",
    uploadDocuments: (claimId: string) => `/api/claims/${claimId}/documents`,
  },
  stock: {
    list: "/api/stock",
  },
  devis: { create: "/api/devis" },
    articles: {
    list: "/api/articles",
  }, // exemple

} as const;
