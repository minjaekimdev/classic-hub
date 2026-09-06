import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { sanitizeImageBuffer } from "./sanitizeImageBuffer";

// 실제 장애 사례(PF287107)에서 발생한, 더미 데이터가 수십 MB 채워진 이미지.
// 원본 47.8MB 중 실제 픽셀 데이터는 1MB 남짓이고, 나머지는 반복 패턴의 더미 바이트.
const DUMMY_IMAGE_PATH = path.join(__dirname, "../datasets/dummy_include_image.jpg");
const PNG_IMAGE_PATH = path.join(__dirname, "../datasets/png_image.png");

describe("sanitizeImageBuffer 비즈니스 로직 테스트", () => {
  describe("더미 데이터가 포함된 이미지 정리", () => {
    let raw: Buffer;
    let cleaned: Buffer;

    // 47MB짜리 fixture이므로 읽기/정리를 한 번만 수행하고 결과를 공유한다
    beforeAll(async () => {
      raw = fs.readFileSync(DUMMY_IMAGE_PATH);
      cleaned = await sanitizeImageBuffer(raw);
    });

    it("더미 데이터가 제거되어 용량이 크게 감소해야 한다", () => {
      // 실측: 47,810,999 bytes -> 약 427,000 bytes (99.1% 감소)
      // 정리 후에도 원본의 1/10을 넘기면 더미가 남아있는 것으로 본다
      expect(cleaned.length).toBeLessThan(raw.length / 10);
    });

    it("출력은 유효한 JPEG이어야 한다 (매직 바이트 FF D8)", () => {
      expect(cleaned[0]).toBe(0xff);
      expect(cleaned[1]).toBe(0xd8);
    });

    it("이미지 픽셀 크기(573x734)는 유지되어야 한다", async () => {
      const meta = await sharp(cleaned).metadata();

      expect(meta.width).toBe(573);
      expect(meta.height).toBe(734);
    });

    it("EXIF 메타데이터가 제거되어야 한다", async () => {
      const rawMeta = await sharp(raw).metadata();
      const cleanedMeta = await sharp(cleaned).metadata();

      // 전제: fixture에 EXIF가 존재해야 이 테스트가 의미 있다
      expect(rawMeta.exif).toBeDefined();
      expect(cleanedMeta.exif).toBeUndefined();
    });
  });

  describe("PNG 입력 정규화", () => {
    // fixture: 950x1130, 4채널(투명도 포함) PNG
    it("PNG 버퍼를 JPEG로 변환해야 한다", async () => {
      const png = fs.readFileSync(PNG_IMAGE_PATH);

      // 전제: 입력이 진짜 PNG인지 확인 (매직 바이트 89 50)
      expect(png[0]).toBe(0x89);
      expect(png[1]).toBe(0x50);

      const result = await sanitizeImageBuffer(png);

      expect(result[0]).toBe(0xff);
      expect(result[1]).toBe(0xd8);

      const meta = await sharp(result).metadata();
      expect(meta.format).toBe("jpeg");
      expect(meta.width).toBe(950);
      expect(meta.height).toBe(1130);
    });
  });

  describe("깨진 버퍼 처리", () => {
    // 에러 정책: null fallback은 상위 오케스트레이터(transformPerformances)의 책임이므로
    // 이 함수는 에러를 조용히 삼키지 않고 그대로 던져야 한다
    it("이미지가 아닌 텍스트 버퍼는 에러를 그대로 던져야 한다", async () => {
      const garbage = Buffer.from("this is not an image at all");

      await expect(sanitizeImageBuffer(garbage)).rejects.toThrow();
    });

    it("빈 버퍼는 에러를 그대로 던져야 한다", async () => {
      await expect(sanitizeImageBuffer(Buffer.alloc(0))).rejects.toThrow();
    });

    it("잘린(손상된) JPEG 버퍼는 에러를 그대로 던져야 한다", async () => {
      const jpeg = await sharp({
        create: { width: 100, height: 100, channels: 3, background: { r: 0, g: 0, b: 255 } },
      })
        .jpeg()
        .toBuffer();
      const truncated = jpeg.subarray(0, 100);

      await expect(sanitizeImageBuffer(truncated)).rejects.toThrow();
    });
  });
});
