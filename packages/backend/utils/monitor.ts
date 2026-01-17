async function sendSlackNotification(message: string) {
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
      throw new Error(`Slack Alarm Send Failed: ${response.statusText}`);
    }

    console.log("Slack 알림 전송 성공");
  } catch (error) {
    console.error("Slack Alarm Send Failed (Network Error):", error);
  }
}
