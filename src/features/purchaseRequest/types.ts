export type PurchaseRequestItem = {
  id: string;
  ITMREF: string;
  ITMDES: string;
  QTYPUU: number;
  PUU: string;
  neededDate:string;
  PSHFCY: string;
};

export type PurchaseRequestForm = {
  neededDate: string;
  YTYPE: string;
  YCMP: string;
  REQUSR: string;
  PSHFCY: string;
  QTYPUU: 1,

  CPY: string;
  PRQDAT: string;
  YMATRICULE: string;
  items: PurchaseRequestItem[];
};
