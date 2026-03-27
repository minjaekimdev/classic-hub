import { FormFieldLayout } from "@/shared/ui/modal/FormField";
import Modal from "@/shared/ui/modal/Modal";
import ModalHeader from "@/shared/ui/modal/ModalHeader";
import useFeedbackModal from "./FeedbackModal.hook";

const FeedbackModal = () => {
  const { isOpen, emailInputRef, contentInputRef, handleSubmit, close } =
    useFeedbackModal();

  return (
    <>
      {isOpen && (
        <Modal.Wrapper>
          <div
            className="rounded-main shadodw-[0_10px_15px_-3px_rgba(0,0,0,0.1),0_4px_6px_-4px_rgba(0,0,0,0.1)] flex max-h-full flex-col gap-[1.7rem] border border-[rgba(0,0,0,0.1)] bg-white p-[1.38rem]"
            onClick={(e) => e.stopPropagation()}
          >
            <ModalHeader
              main="의견 제안"
              sub="ClassicHub를 이용하시면서 불편하셨던 점이나 개선사항을 알려주세요. 소중한 의견을 반영하여 더 나은 서비스를 제공하겠습니다."
            />
            <FormFieldLayout
              id="email"
              label="이메일(선택)"
              verticalPadding="0.22rem"
            >
              <input
                // 이 부분이 핵심입니다!
                // 상위에서 넘어온 범용 ref를 input 전용으로 단언해줍니다.
                ref={emailInputRef}
                className="h-input w-full bg-transparent text-[0.77rem] text-[#717182] outline-none"
                type="email"
                id="email"
                placeholder="답변을 받으실 이메일 주소"
                required={false}
              />
            </FormFieldLayout>
            <FormFieldLayout
              id="feedback"
              label="의견 *"
              verticalPadding="0.44rem"
            >
              <textarea
                // 여기서는 textarea 전용으로 단언해줍니다.
                ref={contentInputRef}
                className="h-textarea w-full resize-none bg-transparent text-[0.77rem] text-[#717182] outline-none"
                id="feedback"
                name="feedback"
                placeholder="개선사항, 불편사항, 기능 제안 등을 자유롭게 작성해주세요."
                required={true}
              />
            </FormFieldLayout>
            <div className="088 flex items-center justify-end gap-[0.44rem]">
              <button
                className="text-dark px-088 rounded-button border border-[rgba(0,0,0,0.1)] bg-white py-[0.44rem] text-[0.77rem]/[1.09rem] font-medium"
                onClick={close}
              >
                취소
              </button>
              <button
                className="px-088 rounded-button bg-main py-[0.44rem] text-[0.77rem]/[1.09rem] font-medium text-white"
                onClick={handleSubmit}
              >
                제출하기
              </button>
            </div>
          </div>
        </Modal.Wrapper>
      )}
    </>
  );
};

export default FeedbackModal;
