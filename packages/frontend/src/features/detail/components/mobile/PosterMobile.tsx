import { useDetail } from "@/pages/Detail";


const PosterMobile = () => {
  const { poster } = useDetail();
  if (!performance) {
    throw new Error("useDetailContext must be used within a DetailProvider");
  }
  return (
    <div className="relative px-[0.88rem] py-[3.18rem] overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center blur-2xl opacity-80"
        style={{ backgroundImage: `url(${poster})` }}
      ></div>
      {/* 2. 그라데이션 오버레이 레이어 (추가된 부분) */}
      <div className="absolute inset-0 bg-linear-to-b from-black/20 to-black/60" />
      <img
        src={poster}
        alt=""
        className="relative z-10 m-auto w-[7.88rem] h-[11.13rem] rounded-main"
      />
    </div>
  );
};

export default PosterMobile;
