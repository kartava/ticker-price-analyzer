import { Module, OnApplicationBootstrap, Provider } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PricesHttpController } from "@src/prices-monitor/controllers/prices.http.controller";
import { PricesService } from "@src/prices-monitor/services/prices-service";
import { PriceStatusService } from "@src/prices-monitor/services/price-status.service";
import { BinanceApiDataProvider } from "@src/prices-monitor/exchange/binance-api-data.provider";
import { MarketDataProvider } from "@src/prices-monitor/exchange/market-data.provider";
import { PriceNotificationService } from "@src/prices-monitor/services/price-notification.service";

const httpControllers = [PricesHttpController];

const providers: Provider[] = [
  PricesService,
  PriceStatusService,
  BinanceApiDataProvider,
  MarketDataProvider,
  PriceNotificationService,
];

@Module({
  imports: [
    HttpModule.registerAsync({
      useFactory: () => ({
        timeout: 5000,
        maxRedirects: 5,
      }),
    }),
  ],
  providers: [...providers],
  controllers: [...httpControllers],
})
export class PricesMonitorModule implements OnApplicationBootstrap {
  constructor(
    private readonly marketDataProvider: MarketDataProvider,
    private readonly priceNotificationService: PriceNotificationService,
  ) {}

  onApplicationBootstrap(): void {
    this.marketDataProvider.initialize();
    this.priceNotificationService.initialize();
  }
}
