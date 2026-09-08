import logger from "./logger";

export async function sendSlackNotification(message: string) {
  const url = process.env.SLACK_WEBHOOK_URL;

  // 알림은 부가 기능이므로 설정 부재로 파이프라인을 중단시키지 않는다.
  if (!url) {
    logger.error(
      "SLACK_WEBHOOK_URL이 설정되어 있지 않아 Slack 알림을 건너뜁니다.",
    );
    return;
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
