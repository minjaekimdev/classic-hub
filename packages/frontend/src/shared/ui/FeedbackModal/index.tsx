import "@app/styles/main.scss";
import styles from "./FeedbackModal.module.scss";
import Modal from "../Modal";
import ModalHeader from "../ModalHeader";
import FormField from "../FormField";
import ButtonGroup from "@/shared/ui/ButtonGroup";

const FeedbackModal = () => {
  return (
    <Modal>
      <div className={styles.feedbackModal}>
        <ModalHeader
          main="의견 제안"
          sub="ClassicHub를 이용하시면서 불편하셨던 점이나 개선사항을 알려주세요. 소중한 의견을 반영하여 더 나은 서비스를 제공하겠습니다."
        />
        <form className={styles.feedbackModal__content}>
          <FormField
            isSingleLine={true}
            type="email"
            id="email"
            label="이메일 (선택)"
            placeHolder="답변을 받으실 이메일 주소"
            verticalPadding="0.22rem"
            inputAreaHeight="1.53rem"
            required={false}
          />
          <FormField
            isSingleLine={false}
            id="feedback"
            label="의견 *"
            placeHolder="개선사항, 불편사항, 기능 제안 등을 자유롭게 작성해주세요."
            verticalPadding="0.44rem"
            inputAreaHeight="2.63rem"
            required={true}
          />
          <ButtonGroup mainText="제출하기" />
        </form>
      </div>
    </Modal>
  );
};

export default FeedbackModal;
