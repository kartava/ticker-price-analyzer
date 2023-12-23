import { Controller, Get } from "@nestjs/common";
import { PricesService } from "../services/prices-service";
import { routesV1 } from "../../configs/app.routes";
import { PriceStatusService } from "../services/price-status.service";
import {
  SymbolPriceDto,
  SymbolPriceStatusDto,
} from "../dtos/price.response.dto";
import { priceStatusConfig } from "../../configs/price-status.config";

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
