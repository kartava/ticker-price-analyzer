import "dotenv/config";
import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { DataCollectorModule } from "./data-collector/data-collector.module";

@Module({
  imports: [ScheduleModule.forRoot(), DataCollectorModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
