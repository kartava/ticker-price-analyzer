import { Injectable, Logger } from "@nestjs/common";
import { map, tap, distinctUntilChanged } from "rxjs";
import { Telegraf } from "telegraf";
import { telegramConfig } from "@configs/telegram.config";
import { priceStatusConfig } from "@configs/price-status.config";
import { MarketDataProvider } from "@src/prices-monitor/exchange/market-data.provider";
import { PriceStatusService } from "@src/prices-monitor/services/price-status.service";
import {
  SymbolPriceStatus,
  SymbolPriceTicker,
} from "@src/prices-monitor/domain/ticker.types";

const bot = new Telegraf(telegramConfig.botToken);

type NotificationState = {
  price: number;
  status: Nullable<SymbolPriceStatus>;
};

@Injectable()
export class PriceNotificationService {
  private readonly logger = new Logger(PriceNotificationService.name);

  constructor(
    private readonly marketDataProvider: MarketDataProvider,
    private readonly priceStatusService: PriceStatusService,
  ) {}

  public initialize(): void {
    this.marketDataProvider.marketData
      .pipe(
        map((symbolTickerList) => this.getPrices(symbolTickerList)),
        map((priceList) => this.getNotificationState(priceList)),
        distinctUntilChanged((prev, curr) => prev.status === curr.status),
        tap((state) => this.notify(state)),
      )
      .subscribe();
  }

  private getPrices(symbolTickerList: SymbolPriceTicker[]): number[] {
    const windowStartIndex = 0 - priceStatusConfig.windowSize;
    return symbolTickerList
      .map((symbolTicker) => symbolTicker.price)
      .slice(windowStartIndex);
  }

  protected getNotificationState(prices: number[]): NotificationState {
    return {
      price: prices[prices.length - 1],
      status: this.priceStatusService.getStatus(prices),
    };
  }

  private async notify(state: NotificationState): Promise<void> {
    if (state.status) {
      const message = `State: ${state.status}\nPrice: ${state.price}`;
      await bot.telegram.sendMessage(telegramConfig.channelId, message);
    }
  }
}
