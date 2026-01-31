// react imports not required here
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@shared/ui/shadcn/accordion";
import { cn } from "@/lib/utils";
import CountBadge from "./CountBadge";
import type { SetStateAction } from "react";

// 데이터 타입
interface Hall {
  id: string;
  name: string;
  count: number;
}

interface Region {
  id: string;
  name: string;
  totalCount: number;
  halls: Hall[];
}

interface RegionFilterAccordionProps {
  data: Region;
  locationSelected: string; // '전체'가 선택되었는지, 특정 지역의 공연장까지 선택되었는지 (후자인 경우 '전체' 선택 해제하기 위함)
  selected: string | null; // 현재 선택된 지역 아코디언
  hallSelected: string | null;
  onRegionSelect: React.Dispatch<SetStateAction<string | null>>; // 각 지역의 아코디언 트리거 클릭 시 다른 지역 아코디언 닫기
  onHallSelect: (regionName: string, hallId: string) => void;
}

export default function RegionFilterAccordion({
  data,
  locationSelected,
  selected,
  hallSelected,
  onRegionSelect,
  onHallSelect,
}: RegionFilterAccordionProps) {
  // 뱃지 숫자 계산 로직: 부모가 전달한 selectedHallId가 있으면 해당 count, 없으면 전체 totalCount
  const currentCount = hallSelected
    ? data.halls.find((v) => v.id === hallSelected)?.count
    : data.totalCount;

  return (
    <div className="w-full border rounded-[0.42rem] bg-white">
      <Accordion
        type="single"
        collapsible
        className="w-full"
        value={selected === data.name ? data.id : ""}
        /* onValueChange: Trigger를 클릭하여 Accordion이 열고 닫힐 때 호출됨. 매개변수 val에는 아이템이 열릴 경우 해당 아이템의 value값이 전달되고, 닫힐 경우 undefined가 전달됨 */
        onValueChange={(val: string) =>
          val ? onRegionSelect(data.name) : onRegionSelect(null)
        }
      >
        {/* AccordionItem에만 value가 있어도 Accordion 열고닫기가 가능함 */}
        <AccordionItem className="border-none" value={data.id}>
          {/* AccordionTrigger:
             - shadcn 기본 동작으로 화살표 회전 애니메이션 포함됨
             - hover:no-underline: Trigger hover시 생기는 텍스트 밑줄 제거
          */}
          <AccordionTrigger className="px-[0.66rem] py-[0.44rem] hover:no-underline hover:bg-gray-50 transition-all rounded-t-xl">
            <div className="flex flex-1 items-center justify-between">
              <span className="text-[#0a0a0a] text-[0.77rem]/[1.09rem]">
                {data.name}
              </span>
              {/* 동적 뱃지 */}
              <CountBadge count={currentCount!} />
            </div>
          </AccordionTrigger>
          <AccordionContent className="pb-[0.44rem]">
            <div className="px-[0.66rem] py-[0.22rem]">
              <ul className="flex flex-col">
                {data.halls.map((hall) => {
                  return (
                    <li
                      key={hall.id}
                      // 공연장 클릭 시 해당 공연장의 지역을 locationSelect로 최신화하기 ('전체' 선택 해제하기)
                      onClick={() => {
                        onHallSelect(data.name, hall.id);
                      }}
                      className={cn(
                        "flex items-center justify-between rounded-[0.22rem] px-[0.66rem] py-[0.44rem] cursor-pointer transition-colors text-[#0a0a0a] text-[0.77rem]/[1.09rem]",
                        // 선택 상태에 따른 조건부 스타일링 (영상과 동일한 붉은색 테마)
                        hallSelected === hall.id
                          ? "bg-red-50 text-main font-medium"
                          : "text-gray-600 hover:bg-gray-50"
                      )}
                    >
                      <span>{hall.name}</span>
                      <span
                        className={cn(
                          "text-[0.66rem]/[0.88rem]",
                          hallSelected === hall.id
                            ? "text-red-600 font-bold"
                            : "text-gray-400"
                        )}
                      >
                        {hall.count}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
