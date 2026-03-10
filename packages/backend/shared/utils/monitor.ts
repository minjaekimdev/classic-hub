import logger from "./logger";

export async function sendSlackNotification(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;

  if (!url) {
    throw new Error("환경변수 SLACK_WEBHOOK_URL이 설정되어 있지 않습니다!");
  }
  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ text: message }),
    });

    if (!response.ok) {
      logger.error(`Slack send failed [${response.status}]`);
    }

    logger.info("Slack send succeeded");
  } catch (error) {
    logger.error("Slack Send Failed (Network Error):", error);
  }
}
