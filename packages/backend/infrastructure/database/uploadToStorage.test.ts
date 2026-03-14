import { describe, expect, it } from "vitest";
import { getStorageFiles, uploadToStorage } from ".";

describe("uploadToStorage 테스트", () => {
  it("Storage에 데이터가 정상 삽입되어야 한다", async () => {
    const bucketName = "performances";
    const folderName = "PF12345";
    const fileName = "sample_image.webp"; // 원하는 파일명
    const sampleBuffer = Buffer.alloc(1024);

    // 핵심: 경로에 폴더명을 포함시킵니다.
    const filePath = `${folderName}/${fileName}`;

    await uploadToStorage(bucketName, filePath, sampleBuffer);

    const result = await getStorageFiles(bucketName);
    expect(result).toHaveLength(1);
  });
});
