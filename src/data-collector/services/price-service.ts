import { Injectable } from "@nestjs/common";
import { SymbolPriceTicker } from "../domain/ticker.types";
import { MarketDataProvider } from "./market-data-provider";

@Injectable()
export class PriceService {
  constructor(private readonly marketDataProvider: MarketDataProvider) {}

  getAllPriceTickers(): SymbolPriceTicker[] {
    return this.marketDataProvider.marketData.getValue();
  }

  getLastNPriceTickers(count: number): SymbolPriceTicker[] {
    const lastNRecordsIndex = 0 - count;
    return this.getAllPriceTickers().slice(lastNRecordsIndex);
  }
}
