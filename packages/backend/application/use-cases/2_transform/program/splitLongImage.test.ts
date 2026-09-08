import { describe, it, expect, beforeAll } from "vitest";
import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { MAX_PIXELS, splitLongImage } from "./splitLongImage";

// 91.6M 픽셀(3334x27480)짜리 실제 KOPIS 상세 이미지.
// MAX_PIXELS(70M)를 초과하므로 분할 경로를 트리거하는 fixture다.
const BIG_IMAGE_PATH = path.join(__dirname, "../datasets/big_resolution_image.png");
const BIG_IMAGE = { width: 3334, height: 27480 } as const;

// OVERLAP_HEIGHT = min(500, maxChunkHeight * 0.2)의 절대 상한
const MAX_OVERLAP = 500;

describe("splitLongImage 비즈니스 로직 테스트", () => {
  describe("픽셀 한도 이하 이미지", () => {
    it("작은 이미지는 자르지 않고 원본 하나만 반환해야 한다", async () => {
      const small = await sharp({
        create: { width: 573, height: 734, channels: 3, background: { r: 255, g: 0, b: 0 } },
      })
        .jpeg()
        .toBuffer();

      const chunks = await splitLongImage(small);

      expect(chunks).toHaveLength(1);
      // 불필요한 재인코딩 없이 원본 버퍼가 그대로 반환되는지까지 검증
      expect(chunks[0]).toBe(small);
    });

    it("정확히 픽셀 한도와 같은 이미지도 잘리지 않아야 한다 (경계값)", async () => {
      // 7000 x 10000 = 정확히 70,000,000 픽셀 ('초과'가 아니라 '이하'일 때도 잘리지 않음)
      const boundary = await sharp({
        create: { width: 7000, height: 10000, channels: 3, background: { r: 255, g: 255, b: 255 } },
      })
        .png()
        .toBuffer();

      const chunks = await splitLongImage(boundary);

      expect(chunks).toHaveLength(1);
      expect(chunks[0]).toBe(boundary);
    });
  });

  describe("픽셀 한도 초과 이미지 (fixture: 3334x27480 = 91.6M 픽셀)", () => {
    let chunkMetas: { width: number; height: number }[];

    // 무거운 분할 작업(실측 약 1.3초)은 한 번만 수행하고 결과를 공유한다
    beforeAll(async () => {
      const chunks = await splitLongImage(fs.readFileSync(BIG_IMAGE_PATH));
      chunkMetas = await Promise.all(
        chunks.map(async (chunk) => {
          const meta = await sharp(chunk).metadata();
          return { width: meta.width!, height: meta.height! };
        }),
      );
    });

    it("두 개 이상의 조각으로 분할되어야 한다", () => {
      expect(chunkMetas.length).toBeGreaterThanOrEqual(2);
    });

    it("모든 조각이 픽셀 한도 이하여야 한다", () => {
      for (const meta of chunkMetas) {
        expect(meta.width * meta.height).toBeLessThanOrEqual(MAX_PIXELS);
      }
    });

    it("모든 조각의 폭이 원본 폭과 같아야 한다 (가로는 잘리지 않는다)", () => {
      for (const meta of chunkMetas) {
        expect(meta.width).toBe(BIG_IMAGE.width);
      }
    });

    it("조각들을 겹침을 감안해 이으면 원본 전체를 커버해야 한다", () => {
      const totalHeight = chunkMetas.reduce((sum, meta) => sum + meta.height, 0);
      const n = chunkMetas.length;

      // 커버리지: 인접 조각끼리의 겹침(중복)을 모두 감안하고도 원본 높이 이상
      expect(totalHeight - MAX_OVERLAP * (n - 1)).toBeGreaterThanOrEqual(BIG_IMAGE.height);
      // 과잉 중복 방지: 겹침이 상한(조각 경계당 최대 500px)을 넘지 않음
      expect(totalHeight - BIG_IMAGE.height).toBeLessThan(MAX_OVERLAP * n);
    });
  });

  describe("이미지가 아닌 입력", () => {
    // 에러 정책: null fallback은 상위 오케스트레이터(transformPerformances)의 책임이므로
    // 이 함수는 에러를 조용히 삼키지 않고 그대로 던져야 한다
    it("이미지가 아닌 버퍼는 에러를 그대로 던져야 한다", async () => {
      const garbage = Buffer.from("not an image at all");

      await expect(splitLongImage(garbage)).rejects.toThrow();
    });
  });
});
