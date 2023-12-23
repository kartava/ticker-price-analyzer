import "dotenv/config";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { PricesMonitorModule } from "./prices-monitor/prices-monitor.module";

@Module({
  imports: [ScheduleModule.forRoot(), PricesMonitorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
