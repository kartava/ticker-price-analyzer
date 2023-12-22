import { Controller, Get } from "@nestjs/common";
import { PriceService } from "../services/price-service";
import { routesV1 } from "../../configs/app.routes";
import { PriceStatusService } from "../services/price-status.service";
import {
  SymbolPriceDto,
  SymbolPriceStatusDto,
} from "../dtos/dtos/price.response.dto";

@Controller()
export class PriceHttpController {
  constructor(
    private readonly priceService: PriceService,
    private readonly priceChangingService: PriceStatusService,
  ) {}

  @Get(routesV1.prices.root)
  async getPrices(): Promise<SymbolPriceDto[]> {
    const prices = await this.priceService.getAllPrices();
    return prices.map((price) => new SymbolPriceDto(price));
  }

  @Get(routesV1.prices.status)
  async getPriceStatus(): Promise<SymbolPriceStatusDto> {
    const pricesData = await this.priceService.getAllPrices();
    const priceList = pricesData.map((record) => {
      return record.price;
    });
    return new SymbolPriceStatusDto({
      status: this.priceChangingService.getStatus(priceList),
    });
  }
}
