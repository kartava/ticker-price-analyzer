import { Injectable } from "@nestjs/common";
import { BehaviorSubject, firstValueFrom } from "rxjs";
import { SymbolPriceTicker } from "../domain/ticker.types";
import { dataCollectorConfig } from "../../configs/data-collector.config";

@Injectable()
export class PriceService {
  private symbolPricesSubject = new BehaviorSubject<SymbolPriceTicker[]>([]);

  async getAllPrices(): Promise<SymbolPriceTicker[]> {
    return await firstValueFrom(this.symbolPricesSubject.asObservable());
  }

  updatePrice(record: SymbolPriceTicker): void {
    const currentValues = this.symbolPricesSubject.getValue();
    if (currentValues.length >= dataCollectorConfig.windowLength) {
      currentValues.shift();
    }
    this.symbolPricesSubject.next([...currentValues, record]);
  }
}
