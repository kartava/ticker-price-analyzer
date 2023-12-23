export type SymbolPriceTickerResponse = {
  symbol: string;
  price: string;
};

export type SymbolPriceTicker = {
  symbol: string;
  price: number;
  time: string;
};

export enum SymbolPriceStatus {
  PUMPING = "PUMPING",
  DUMPING = "DUMPING",
}
