export type PurchaseRequestItem = {
  id: string;
  ITMREF: string;
  ITMDES: string;
  QTYPUU: number;
  PUU: string;
  EXTRCPDAT:string;
  PSHFCY: string;
};

export type PurchaseRequestForm = {
  EXTRCPDAT: string;
  YTYPE: string;
  YCMPASS: string;
  REQUSR: string;
  PSHFCY: string;
  QTYPUU: 1,

  PSHNUM: string;
  PRQDAT: string;
  YMATRICULE: string;
  items: PurchaseRequestItem[];
};
