import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { Cron, CronExpression } from "@nestjs/schedule";
import { binanceConfig } from "../../configs/binance.config";
import {
  SymbolPriceTicker,
  SymbolPriceTickerResponse,
} from "../domain/ticker.types";
import { catchError, map, tap } from "rxjs";
import { AxiosError } from "axios";
import { PriceService } from "../services/price-service";

@Injectable()
export class PricePopulationJob {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly priceService: PriceService,
  ) {}

  @Cron(CronExpression.EVERY_5_SECONDS)
  async updateTickerPriceData(): Promise<void> {
    const { apiUrl, tickerSymbol } = binanceConfig;
    const url = `${apiUrl}/ticker/price?symbol=${tickerSymbol}`;

    this.httpService
      .get<SymbolPriceTickerResponse>(url)
      .pipe(
        catchError((error: AxiosError) => {
          this.logger.error(error);
          throw new Error("An error happened!");
        }),
        map((response) => {
          return {
            symbol: response.data.symbol,
            price: Number.parseFloat(response.data.price),
            time: new Date().toISOString(),
          } satisfies SymbolPriceTicker;
        }),
        tap((data) => {
          this.logger.debug("Price Received:", data);
        }),
      )
      .subscribe((data) => {
        this.priceService.updatePrice(data);
      });
  }
}
