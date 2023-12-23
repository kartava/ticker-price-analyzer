import "dotenv/config";
import { Module } from "@nestjs/common";
import { PricesMonitorModule } from "@src/prices-monitor/prices-monitor.module";

@Module({
  imports: [PricesMonitorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
