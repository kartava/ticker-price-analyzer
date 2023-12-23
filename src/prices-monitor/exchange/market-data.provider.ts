import { Injectable, Logger } from "@nestjs/common";
import { BehaviorSubject, interval, Observable, switchMap } from "rxjs";
import { HttpService } from "@nestjs/axios";
import { SymbolPriceTicker } from "@src/prices-monitor/domain/ticker.types";
import { BinanceApiDataProvider } from "@src/prices-monitor/exchange/binance-api-data.provider";
import { marketDataProviderConfig } from "@configs/market-data-provider.config";

@Injectable()
export class MarketDataProvider {
  private readonly logger = new Logger(MarketDataProvider.name);
  private marketData$ = new BehaviorSubject<SymbolPriceTicker[]>([]);

  constructor(
    private readonly httpService: HttpService,
    private readonly apiDataProvider: BinanceApiDataProvider,
  ) {}

  public initialize(): void {
    this.createStreamWithTimeout(marketDataProviderConfig.pollingPeriod)
      .pipe(switchMap(() => this.apiDataProvider.fetchData()))
      .subscribe((upcomingData) => {
        const currentData = this.marketData$.getValue();
        this.marketData$.next([...currentData, upcomingData]);
      });
  }

  public get marketData(): BehaviorSubject<SymbolPriceTicker[]> {
    return this.marketData$;
  }

  private createStreamWithTimeout(timeout: number): Observable<number> {
    return interval(timeout);
  }
}
