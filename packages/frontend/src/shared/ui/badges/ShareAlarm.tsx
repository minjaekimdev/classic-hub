import checkIcon from "@shared/assets/icons/check-share-alarm.svg";

const ShareAlarm = () => {
  return (
    <div className="flex items-center rounded-xl border border-[rgba(0,0,0,0.1)] bg-white shadow-[0_4px_12px_0_rgba(0,0,0,0.1)] w-89 h-[4.6rem]">
      <div className="flex items-center gap-[0.62rem] ml-[0.88rem]">
        <img src={checkIcon} alt="" />
        <div className="flex flex-col gap-[0.12rem]">
          <span className="text-dark text-[0.81rem]/[1.22rem]">
            링크가 복사되었습니다!
          </span>
          <span className="text-[#3f3f3f] text-[0.81rem]/[1.14rem]">
            공유하고 싶은 곳에 붙여넣기 하세요.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ShareAlarm;
