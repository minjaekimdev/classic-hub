import { describe, expect, it } from "vitest";
import getDetailImage from "@/application/use-cases/fetchers/getDetailImage";
import { fileTypeFromBuffer } from "file-type";
import { uploadToStorage, getStorageFiles } from "./storage";

describe("uploadToStorage 테스트", () => {
  it("Storage에 데이터가 정상 삽입되어야 한다", async () => {
    const bucketName = "performances";
    const folderName = "PF12345";
    const fileName = "sample_image.webp"; // 원하는 파일명
    const sampleBuffer = Buffer.alloc(1024);

    // 핵심: 경로에 폴더명을 포함시킵니다.
    const filePath = `${folderName}/${fileName}`;

    await uploadToStorage(bucketName, filePath, sampleBuffer, {
      contentType: "image/webp",
      upsert: true,
    });

    const result = await getStorageFiles(bucketName);
    expect(result).toHaveLength(1);
  });

  it("Storage에 ArrayBuffer 이미지 데이터가 정상 삽입되어야 한다", async () => {
    const bucketName = "performances";
    const folderName = "PF78912";
    const response = await getDetailImage(
      "http://www.kopis.or.kr/upload/pfmPoster/PF_PF285267_260219_104913.jpg",
    );

    const type = await fileTypeFromBuffer(response);
    const extension = type?.ext ?? "jpeg";
    const contentType = type?.mime ?? "image/jpeg";

    const fileName = `sample_image3.${extension}`;

    const filePath = `${folderName}/${fileName}`;
    await uploadToStorage(bucketName, filePath, response, {
      contentType: contentType,
      upsert: true,
    });

    const result = await getStorageFiles(bucketName, filePath);
    console.log(result);

    expect(result).toHaveLength(1);
  });
});
