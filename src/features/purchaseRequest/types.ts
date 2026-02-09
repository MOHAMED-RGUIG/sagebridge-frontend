export type PurchaseRequestItem = {
  id: string;
  ITMREF_0: string;
  ITMDES1_0: string;
  QTYPUU: number;
  PUU_0: string;
  EXTRCPDAT:string;
  TSICOD_0: string;
  TSICOD_1: string;
  TSICOD_2: string;
  TSICOD_3: string;
  TSICOD_4: string;

};

export type PurchaseRequestForm = {
  EXTRCPDAT: string;
  YTYPE_0: string;
  YCMPASS: string;
  REQUSR: string;
  PSHFCY: string;
  QTYPUU: 1,

  PSHNUM_0: string;
  PRQDAT_0: string;
  YMATRICULE: string;
  items: PurchaseRequestItem[];
};
