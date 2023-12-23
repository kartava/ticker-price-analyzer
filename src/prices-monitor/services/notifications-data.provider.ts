import { Injectable } from "@nestjs/common";
import { distinctUntilKeyChanged, map, Subject } from "rxjs";
import {
  NotificationState,
  SymbolPriceTicker,
} from "@src/prices-monitor/domain/prices.types";
import { MarketDataProvider } from "@src/prices-monitor/exchange/market-data.provider";
import { priceStatusConfig } from "@configs/price-status.config";
import { PriceStatusService } from "@src/prices-monitor/services/price-status.service";

@Injectable()
export class NotificationsDataProvider {
  private readonly notificationState$ = new Subject<NotificationState>();

  constructor(
    private readonly marketDataProvider: MarketDataProvider,
    private readonly priceStatusService: PriceStatusService,
  ) {}

  public initialize(): void {
    this.marketDataProvider.marketData
      .pipe(
        map((symbolTickerList) => this.getPrices(symbolTickerList)),
        map((priceList) => this.getNotificationState(priceList)),
        distinctUntilKeyChanged("status"),
      )
      .subscribe((upcomingState) =>
        this.populateNotificationData(upcomingState),
      );
  }

  private getPrices(symbolTickerList: SymbolPriceTicker[]): number[] {
    const windowStartIndex = 0 - priceStatusConfig.windowSize;
    return symbolTickerList
      .map((symbolTicker) => symbolTicker.price)
      .slice(windowStartIndex);
  }

  private getNotificationState(prices: number[]): NotificationState {
    return {
      price: prices[prices.length - 1],
      status: this.priceStatusService.getStatus(prices),
    };
  }

  private populateNotificationData(upcomingState: NotificationState): void {
    this.notificationState$.next(upcomingState);
  }

  get notificationState(): Subject<NotificationState> {
    return this.notificationState$;
  }
}
