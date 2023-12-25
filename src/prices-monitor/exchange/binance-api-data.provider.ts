import { Injectable, Logger } from "@nestjs/common";
import { AxiosError } from "axios";
import { HttpService } from "@nestjs/axios";
import { catchError, map, Observable, tap } from "rxjs";
import {
  SymbolPriceTicker,
  SymbolPriceTickerResponse,
} from "@src/prices-monitor/domain/prices.types";
import { binanceConfig } from "@configs/binance.config";

@Injectable()
export class BinanceApiDataProvider {
  private readonly logger = new Logger(BinanceApiDataProvider.name);

  constructor(private readonly httpService: HttpService) {}

  fetchData(): Observable<SymbolPriceTicker> {
    const { apiUrl, tickerSymbol } = binanceConfig;
    const url = `${apiUrl}/ticker/price?symbol=${tickerSymbol}`;
    return this.httpService.get<SymbolPriceTickerResponse>(url).pipe(
      catchError((error: AxiosError) => {
        this.logger.error(error);
        throw new Error("An error happened!");
      }),
      map(
        (response) =>
          ({
            symbol: response.data.symbol,
            price: Number.parseFloat(response.data.price),
            time: new Date().toISOString(),
          }) satisfies SymbolPriceTicker,
      ),
      tap((data) => {
        this.logger.debug(`Market Data Received: ${JSON.stringify(data)}`);
      }),
    );
  }
}
