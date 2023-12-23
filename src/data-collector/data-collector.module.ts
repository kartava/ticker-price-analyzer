import { Module, OnApplicationBootstrap, Provider } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PriceService } from "./services/price-service";
import { PriceHttpController } from "./controllers/price.http.controller";
import { PriceStatusService } from "./services/price-status.service";
import { MarketDataProvider } from "./services/market-data-provider";
import { BinanceApiDataProvider } from "./exchange/binance-api-data.provider";

const httpControllers = [PriceHttpController];

const providers: Provider[] = [
  PriceService,
  PriceStatusService,
  BinanceApiDataProvider,
  MarketDataProvider,
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
export class DataCollectorModule implements OnApplicationBootstrap {
  constructor(private readonly marketDataProvider: MarketDataProvider) {}

  onApplicationBootstrap(): void {
    this.marketDataProvider.initialize();
  }
}
