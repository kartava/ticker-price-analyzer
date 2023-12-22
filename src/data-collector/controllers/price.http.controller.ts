import { Controller, Get } from "@nestjs/common";
import { PriceService } from "../services/price-service";
import { SymbolPriceTicker } from "../domain/ticker.types";
import { routesV1 } from "../../configs/app.routes";

@Controller()
export class PriceHttpController {
  constructor(private readonly priceService: PriceService) {}

  @Get(routesV1.prices.root)
  async getPrices(): Promise<SymbolPriceTicker[]> {
    return await this.priceService.getAllPrices();
  }
}
