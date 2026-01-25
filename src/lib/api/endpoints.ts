export const ENDPOINTS = {
  purchaseRequest: {
    create: "/api/purchase-requests",
  },
  claims: {
    create: "/api/claims",
    uploadDocuments: (claimId: string) => `/api/claims/${claimId}/documents`,
  },
  stock: {
    list: "/api/stock",
  },
} as const;
