import { Injectable, Logger } from "@nestjs/common";
import { tap } from "rxjs";
import { Telegraf } from "telegraf";
import { telegramConfig } from "@configs/telegram.config";
import { NotificationsDataProvider } from "@src/prices-monitor/services/notifications-data.provider";
import { NotificationState } from "@src/prices-monitor/domain/prices.types";

const bot = new Telegraf(telegramConfig.botToken);

@Injectable()
export class PriceNotificationService {
  private readonly logger = new Logger(PriceNotificationService.name);

  constructor(
    private readonly notificationsDataProvider: NotificationsDataProvider,
  ) {}

  public initialize(): void {
    this.notificationsDataProvider.notificationState
      .pipe(tap((state) => this.notify(state)))
      .subscribe();
  }

  private async notify(state: NotificationState): Promise<void> {
    if (state.status) {
      const message = `State: ${state.status}\nPrice: ${state.price}`;
      await bot.telegram.sendMessage(telegramConfig.channelId, message);
    }
  }
}
