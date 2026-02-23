import type { QueryObserverResult } from "@tanstack/react-query";

interface ErrorMessageWithRefetchProps {
  // void 대신 Promise를 반환하는 함수 타입으로 정의합니다.
  refetch: () => Promise<QueryObserverResult>;
}

export const ErrorMessageWithRefetch = ({
  refetch,
}: ErrorMessageWithRefetchProps) => {
  return (
    <div className="flex flex-col items-center justify-center py-10 gap-3">
      <p className="text-gray-500 text-[0.88rem]">
        데이터를 불러오는 데 실패했습니다.
      </p>
      <button
        onClick={() => refetch()}
        className="px-4 py-2 bg-gray-100 text-dark text-[0.77rem] rounded-button hover:bg-gray-200 transition-colors"
      >
        다시 시도
      </button>
    </div>
  );
};
