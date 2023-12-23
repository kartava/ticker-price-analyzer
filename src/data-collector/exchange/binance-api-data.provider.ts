import { Injectable, Logger } from "@nestjs/common";
import { PriceService } from "../services/price-service";
import { HttpService } from "@nestjs/axios";
import { catchError, map, Observable, tap } from "rxjs";
import {
  SymbolPriceTicker,
  SymbolPriceTickerResponse,
} from "../domain/ticker.types";
import { binanceConfig } from "../../configs/binance.config";
import { AxiosError } from "axios";

@Injectable()
export class BinanceApiDataProvider {
  private readonly logger = new Logger(PriceService.name);

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
          }) as SymbolPriceTicker,
      ),
      tap((data) => {
        this.logger.debug("Price Received:", data);
      }),
    );
  }
}
