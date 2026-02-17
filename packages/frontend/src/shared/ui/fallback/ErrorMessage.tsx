export const ErrorMessage = ({ title }: { title: string }) => {
  return (
    <div className="w-full h-40 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
      {title} 정보를 불러오지 못했습니다.
    </div>
  );
};
