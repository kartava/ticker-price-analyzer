import { get } from "env-var";

export const priceStatusConfig = {
  pumpRatio: get("PRICE_STATUS_PUMP_RATIO").required().asFloat(),
  dumpRatio: get("PRICE_STATUS_DUMP_RATIO").required().asFloat(),
  windowSize: get("PRICE_STATUS_WINDOW_SIZE").required().asInt(),
};
