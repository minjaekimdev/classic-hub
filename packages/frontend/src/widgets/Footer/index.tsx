import styles from "./Footer.module.scss";
import "@app/styles/main.scss";
import feedbackIcon from "./feedback.svg";

const Origin = () => {
  return (
    <p className={styles.footer__text}>
      이 서비스의 콘텐츠 출처는 (주)공연통합예술전산망 입니다.
    </p>
  );
};

const FeedbackButton = () => {
  return (
    <button className={styles.feedback}>
      <div className={styles.feedback__wrapper}>
        <img src={feedbackIcon} alt="" />
        의견 제안
      </div>
    </button>
  );
};

const Footer = () => {
  return (
    <div className={styles.footer}>
      <div className={styles.footer__wrapper}>
        <Origin />
        <FeedbackButton />
      </div>
    </div>
  );
};

export default Footer;
