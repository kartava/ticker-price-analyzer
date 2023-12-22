import { get } from "env-var";

export const binanceConfig = {
  apiUrl: get("BINANCE_API_URL").required().asString(),
  tickerSymbol: get("BINANCE_TICKER_SYMBOL").required().asString(),
};
