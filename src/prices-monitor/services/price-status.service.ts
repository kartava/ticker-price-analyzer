import { Injectable } from "@nestjs/common";
import { SymbolPriceStatus } from "../domain/ticker.types";
import { priceStatusConfig } from "../../configs/price-status.config";

@Injectable()
export class PriceStatusService {
  public getStatus(prices: number[]): Nullable<SymbolPriceStatus> {
    const averagePrice = this.getAveragePrice(prices);
    return this.detectPriceChanging(prices, averagePrice);
  }

  private getAveragePrice(prices: number[]): number {
    const sum = prices.reduce((acc, price) => acc + price, 0);
    return sum / prices.length;
  }

  private detectPriceChanging(
    prices: number[],
    average: number,
  ): Nullable<SymbolPriceStatus> {
    const currentPrice = prices[prices.length - 1];

    const pumpingThreshold = priceStatusConfig.pumpRatio * average;
    if (currentPrice > pumpingThreshold) {
      return SymbolPriceStatus.PUMPING;
    }

    const dumpingThreshold = priceStatusConfig.dumpRatio * average;
    if (currentPrice < dumpingThreshold) {
      return SymbolPriceStatus.DUMPING;
    }
    return null;
  }
}
