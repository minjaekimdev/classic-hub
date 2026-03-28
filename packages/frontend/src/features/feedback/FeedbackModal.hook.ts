import supabase from "@/app/api/supabase-client";
import { useModal } from "@/app/providers/modal/useModal";
import { useRef } from "react";

const useFeedbackModal = () => {
  const { closeModal } = useModal();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const contentInputRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const email = emailInputRef.current?.value;
    const content = contentInputRef.current?.value;

    if (!content) {
      alert("내용을 입력해주세요!");
      return;
    }

    const { error } = await supabase.from("feedbacks").insert([
      {
        email,
        content,
      },
    ]);
    if (error) {
      console.error("데이터 저장 실패:", error.message);
      alert("저장 중 오류가 발생했습니다.");
      return;
    }

    alert("피드백이 저장되었습니다!");
    closeModal();
  };

  return { emailInputRef, contentInputRef, handleSubmit, closeModal };
};

export default useFeedbackModal;
