import { get } from "env-var";

export const telegramConfig = {
  botToken: get("TELEGRAM_BOT_TOKEN").required().asString(),
  channelId: get("TELEGRAM_NOTIFICATION_CHANNEL_ID").required().asString(),
};
