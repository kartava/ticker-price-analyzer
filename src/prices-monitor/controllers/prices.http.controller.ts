import { Controller, Get } from "@nestjs/common";
import { routesV1 } from "@configs/app.routes";
import { priceStatusConfig } from "@configs/price-status.config";
import { PricesService } from "@src/prices-monitor/services/prices-service";
import { PriceStatusService } from "@src/prices-monitor/services/price-status.service";
import {
  SymbolPriceDto,
  SymbolPriceStatusDto,
} from "@src/prices-monitor/dtos/price.response.dto";

@Controller()
export class PricesHttpController {
  constructor(
    private readonly priceService: PricesService,
    private readonly priceChangingService: PriceStatusService,
  ) {}

  @Get(routesV1.prices.root)
  async getPrices(): Promise<SymbolPriceDto[]> {
    const prices = this.priceService.getLastNPriceTickers(
      priceStatusConfig.windowSize,
    );
    return prices.map((price) => new SymbolPriceDto(price));
  }

  @Get(routesV1.prices.status)
  async getPriceStatus(): Promise<SymbolPriceStatusDto> {
    const pricesData = this.priceService.getAllPriceTickers();
    const priceList = pricesData.map((record) => {
      return record.price;
    });
    return new SymbolPriceStatusDto({
      status: this.priceChangingService.getStatus(priceList),
    });
  }
}
