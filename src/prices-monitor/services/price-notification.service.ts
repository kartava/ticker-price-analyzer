import { Injectable, Logger } from "@nestjs/common";
import { map, tap, distinctUntilChanged } from "rxjs";
import { Telegraf } from "telegraf";
import { telegramConfig } from "@configs/telegram.config";
import { priceStatusConfig } from "@configs/price-status.config";
import { MarketDataProvider } from "@src/prices-monitor/exchange/market-data.provider";
import { PriceStatusService } from "@src/prices-monitor/services/price-status.service";
import { SymbolPriceStatus } from "@src/prices-monitor/domain/ticker.types";

const bot = new Telegraf(telegramConfig.botToken);

@Injectable()
export class PriceNotificationService {
  private readonly logger = new Logger(PriceNotificationService.name);

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
