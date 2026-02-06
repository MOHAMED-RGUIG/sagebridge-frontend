export type StockQuery = {
  q: string;
  
  date?: string;        // date précise
  dateFrom?: string;    // début intervalle
  dateTo?: string;      // fin intervalle
  site: string;
};
