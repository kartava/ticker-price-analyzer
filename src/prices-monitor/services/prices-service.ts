import { Injectable } from "@nestjs/common";
import { MarketDataProvider } from "@src/prices-monitor/exchange/market-data.provider";
import { SymbolPriceTicker } from "@src/prices-monitor/domain/prices.types";

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
