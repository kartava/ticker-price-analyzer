import { Injectable } from "@nestjs/common";
import { SymbolPriceTicker } from "../domain/ticker.types";
import { MarketDataProvider } from "../exchange/market-data.provider";

@Injectable()
export class PricesService {
  constructor(private readonly marketDataProvider: MarketDataProvider) {}

  getAllPriceTickers(): SymbolPriceTicker[] {
    return this.marketDataProvider.marketData.getValue();
  }

  getLastNPriceTickers(count: number): SymbolPriceTicker[] {
    const windowStartIndex = 0 - count;
    return this.getAllPriceTickers().slice(windowStartIndex);
  }
}
