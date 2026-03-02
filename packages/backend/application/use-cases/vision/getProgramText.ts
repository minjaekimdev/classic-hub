import ocr from "@/infrastructure/external-api/vision";
import { APIError, withErrorHandling } from "utils/error";

const getProgramText = async (images: string | string[]) => {
  const imageArr = Array.isArray(images) ? images : [images];

  const useOcr = async (image: Buffer) => {
    const [result] = await ocr.textDetection(image);
    return result.fullTextAnnotation?.text || "";
  }

  const images = await Promise.all(imageArr.map((img, ) => ));

  // imageArr의 url을 Promise.all로 동시에 호출한 뒤 결과 받아오기
  const textArr = await Promise.all(imageArr.map((img,) => useOcr(img)))

  // 텍스트 합쳐서 반환하기

  


};

export default getProgramText;