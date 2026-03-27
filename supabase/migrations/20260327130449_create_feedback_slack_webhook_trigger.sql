CREATE OR REPLACE FUNCTION public.handle_feedback_notification()
RETURNS TRIGGER AS $$
DECLARE
  webhook_url TEXT;
  payload JSONB;
BEGIN
  -- 1. Vault에서 슬랙 웹훅 URL 가져오기
  SELECT decrypted_secret INTO webhook_url 
  FROM vault.decrypted_secrets 
  WHERE name = 'slack_webhook';

  IF webhook_url IS NOT NULL THEN
    -- 2. 슬랙 메시지 구조 생성
    payload := jsonb_build_object(
      'text', '📬 새로운 피드백이 도착했습니다!',
      'blocks', jsonb_build_array(
        jsonb_build_object(
          'type', 'header',
          'text', jsonb_build_object('type', 'plain_text', 'text', '📬 새 피드백 도착')
        ),
        -- 작성자 이메일 (직접 입력받은 값)
        jsonb_build_object(
          'type', 'section',
          'text', jsonb_build_object(
            'type', 'mrkdwn', 
            'text', '작성자(Email): ' || COALESCE(NEW.email, '익명(비회원)')
          )
        ),
        -- 의견 내용
        jsonb_build_object(
          'type', 'section',
          'text', jsonb_build_object(
            'type', 'mrkdwn', 
            'text', '의견 내용: ' || NEW.content
          )
        ),
        jsonb_build_object('type', 'divider')
      )
    );

    -- 3. 슬랙 전송
    PERFORM net.http_post(
      url := webhook_url,
      headers := '{"Content-Type": "application/json"}'::jsonb,
      body := payload
    );
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER tr_after_feedback_insert
  AFTER INSERT ON public.feedbacks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_feedback_notification();