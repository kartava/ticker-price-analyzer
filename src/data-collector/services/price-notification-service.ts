import { Injectable, Logger } from "@nestjs/common";
import { map, tap } from "rxjs";
import { SymbolPriceStatus } from "../domain/ticker.types";
import { PriceService } from "./price-service";
import { MarketDataProvider } from "./market-data-provider";
import { telegramConfig } from "../../configs/telegram.config";
import { Telegraf } from "telegraf";
import { PriceStatusService } from "./price-status.service";
import { distinctUntilChanged } from "rxjs";
import { priceStatusConfig } from "../../configs/price-status.config";

const bot = new Telegraf(telegramConfig.botToken);

@Injectable()
export class PriceNotificationService {
  private readonly logger = new Logger(PriceService.name);

  constructor(
    private readonly marketDataProvider: MarketDataProvider,
    private readonly priceStatusService: PriceStatusService,
  ) {}

  public initialize(): void {
    const windowStartIndex = 0 - priceStatusConfig.windowSize;
    this.marketDataProvider.marketData
      .pipe(
        map((symbolTickerList) =>
          symbolTickerList
            .map((symbolTicker) => symbolTicker.price)
            .slice(windowStartIndex),
        ),
      )
      .pipe(map((prices) => this.getStatus(prices)))
      .pipe(distinctUntilChanged())
      .pipe(tap((status) => this.notify(status)))
      .subscribe();
  }

  private getStatus(prices: number[]): Nullable<SymbolPriceStatus> {
    return this.priceStatusService.getStatus(prices);
  }

  private async notify(status: Nullable<SymbolPriceStatus>): Promise<void> {
    if (status) {
      await bot.telegram.sendMessage(telegramConfig.channelId, status);
    }
  }
}
