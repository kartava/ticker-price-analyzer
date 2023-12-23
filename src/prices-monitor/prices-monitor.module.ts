import { Module, OnApplicationBootstrap, Provider } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PricesService } from "./services/prices-service";
import { PricesHttpController } from "./controllers/prices.http.controller";
import { PriceStatusService } from "./services/price-status.service";
import { MarketDataProvider } from "./exchange/market-data.provider";
import { BinanceApiDataProvider } from "./exchange/binance-api-data.provider";
import { PriceNotificationService } from "./services/price-notification.service";

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
