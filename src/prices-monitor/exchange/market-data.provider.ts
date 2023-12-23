import { Injectable } from "@nestjs/common";
import { BehaviorSubject, interval, Observable, switchMap } from "rxjs";
import { SymbolPriceTicker } from "@src/prices-monitor/domain/prices.types";
import { BinanceApiDataProvider } from "@src/prices-monitor/exchange/binance-api-data.provider";
import { marketDataProviderConfig } from "@configs/market-data-provider.config";

@Injectable()
export class MarketDataProvider {
  private readonly poolSize = marketDataProviderConfig.poolSize;
  private readonly marketData$ = new BehaviorSubject<SymbolPriceTicker[]>([]);

  constructor(private readonly apiDataProvider: BinanceApiDataProvider) {}

  public initialize(): void {
    this.createStreamWithTimeout(marketDataProviderConfig.pollingPeriod)
      .pipe(switchMap(() => this.apiDataProvider.fetchData()))
      .subscribe((upcomingData) => this.populateMarketData(upcomingData));
  }

  public get marketData(): BehaviorSubject<SymbolPriceTicker[]> {
    return this.marketData$;
  }

  private createStreamWithTimeout(timeout: number): Observable<number> {
    return interval(timeout);
  }

  private populateMarketData(upcomingData: SymbolPriceTicker): void {
    const currentValues = this.marketData$.getValue();
    if (currentValues.length >= this.poolSize) {
      currentValues.shift();
    }
    this.marketData$.next([...currentValues, upcomingData]);
  }
}
