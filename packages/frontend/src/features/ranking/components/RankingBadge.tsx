// RankBadge 컴포넌트 예시
const RankBadge = ({ rank }: { rank: number }) => {
  // 1~3위는 특별한 색상, 나머지는 검정색 배경
  const bgStyle = rank === 1 ? "bg-[#D4AF37]" : // 앤틱 골드
                  rank === 2 ? "bg-[#A8A9AD]" : // 실버
                  rank === 3 ? "bg-[#CD7F32]" : // 브론즈
                  "bg-[#333333]"; // 4위 이하는 다크 그레이

  return (
    <div className={`absolute top-0 left-0 w-10 h-10 flex justify-center items-center ${bgStyle} rounded-br-xl shadow-md`}>
      <span className="font-serif font-bold italic text-white text-lg">
        {rank}
      </span>
    </div>
  );
};

export default RankBadge