import { SymbolPriceStatus } from "../domain/ticker.types";

export class SymbolPriceDto {
  symbol: string;
  price: number;
  time: string;

  constructor(props: SymbolPriceDto) {
    this.symbol = props.symbol;
    this.price = props.price;
    this.time = props.time;
  }
}

export class SymbolPriceStatusDto {
  status: Nullable<SymbolPriceStatus>;

  constructor(props: SymbolPriceStatusDto) {
    this.status = props.status;
  }
}
