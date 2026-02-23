const EmptyState = ({ text }: { text: string }) => {
  return (
    <div className="w-full h-40 flex items-center justify-center text-gray-500 bg-gray-50 rounded-lg">
      {text}
    </div>
  );
};

export default EmptyState