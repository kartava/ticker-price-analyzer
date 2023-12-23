import { Injectable, Logger } from "@nestjs/common";
import { BehaviorSubject, interval, Observable, switchMap } from "rxjs";
import { SymbolPriceTicker } from "../domain/ticker.types";
import { HttpService } from "@nestjs/axios";
import { PricesService } from "../services/prices-service";
import { BinanceApiDataProvider } from "./binance-api-data.provider";
import { marketDataProviderConfig } from "../../configs/market-data-provider.config";

@Injectable()
export class MarketDataProvider {
  private readonly logger = new Logger(PricesService.name);
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
