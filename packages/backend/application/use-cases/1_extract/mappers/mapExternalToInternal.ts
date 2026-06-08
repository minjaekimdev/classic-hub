import { PerformanceDetail } from "@/shared/types/kopis";
import { InternalPerformance } from "../types";

// KOPIS 원본 객체 데이터를 개발용 객체 데이터로 변환
// posterBuffer에는 데이터 정합성을 위해 완전한 형태의 버퍼가 들어와야 한다.
export const mapExternalToInternal = (
  rawData: PerformanceDetail,
  posterBuffer: Buffer,
  detailImageBuffers: Buffer[],
): InternalPerformance => {
  return {
    performanceId: rawData.mt20id,
    venueId: rawData.mt10id,
    title: rawData.prfnm,
    startDate: rawData.prfpdfrom,
    endDate: rawData.prfpdto,
    venueName: rawData.fcltynm,
    cast: rawData.prfcast,
    crew: rawData.prfcrew,
    runtime: rawData.prfruntime,
    ageLimit: rawData.prfage,
    productionCompany: rawData.entrpsnmP,
    agencyCompany: rawData.entrpsnmA,
    hostCompany: rawData.entrpsnmH,
    organizerCompany: rawData.entrpsnmS,
    priceInfo: rawData.pcseguidance,
    posterUrl: rawData.poster,
    posterImage: posterBuffer, // 전달받은 버퍼 데이터
    description: rawData.sty,
    area: rawData.area,
    genre: rawData.genrenm,
    status: rawData.prfstate,
    isOpenRun: rawData.openrun,
    isVisit: rawData.visit,
    isChildFriendly: rawData.child,
    isDaehakro: rawData.daehakro,
    isFestival: rawData.festival,
    isMusicalLicense: rawData.musicallicense,
    isMusicalCreate: rawData.musicalcreate,
    updatedAt: rawData.updatedate,
    bookingLinks: Array.isArray(rawData.relates.relate)
      ? rawData.relates.relate
      : [rawData.relates.relate],
    detailImages: detailImageBuffers, // 전달받은 상세 이미지 버퍼 배열
    scheduleInfo: rawData.dtguidance,
  };
};
