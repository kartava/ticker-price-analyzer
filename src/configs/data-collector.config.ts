import { get } from "env-var";

export const dataCollectorConfig = {
  windowLength: get("DATA_COLLECTOR_WINDOW_LENGTH").required().asIntPositive(),
};
