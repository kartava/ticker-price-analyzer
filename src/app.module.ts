import "dotenv/config";
import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { ScheduleModule } from "@nestjs/schedule";
import { DataCollectorModule } from "./data-collector/data-collector.module";

@Module({
  imports: [ScheduleModule.forRoot(), DataCollectorModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
