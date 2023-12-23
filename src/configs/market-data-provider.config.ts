import { get } from "env-var";

export const marketDataProviderConfig = {
  pollingPeriod: get("MARKET_DATA_PROVIDER_POLLING_PERIOD").required().asInt(),
  poolSize: get("MARKET_DATA_POOL_SIZE").required().asInt(),
};
