import { get } from "env-var";

export const priceStatusConfig = {
  pumpTriggerAmount: get("PRICE_STATUS_PUMP_TRIGGER_AMOUNT").required().asInt(),
  dumpTriggerAmount: get("PRICE_STATUS_DUMP_TRIGGER_AMOUNT").required().asInt(),
  windowSize: get("PRICE_STATUS_WINDOW_SIZE").required().asInt(),
};
