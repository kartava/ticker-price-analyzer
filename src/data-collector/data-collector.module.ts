import { Module, Provider } from "@nestjs/common";
import { HttpModule } from "@nestjs/axios";
import { PriceService } from "./services/price-service";
import { PriceHttpController } from "./controllers/price.http.controller";
import { PricePopulationJob } from "./jobs/price-population.job";
import { PriceStatusService } from "./services/price-status.service";

const httpControllers = [PriceHttpController];

const providers: Provider[] = [
  PriceService,
  PriceStatusService,
  PricePopulationJob,
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
export class DataCollectorModule {}
