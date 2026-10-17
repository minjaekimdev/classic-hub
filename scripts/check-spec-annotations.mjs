#!/usr/bin/env node
/**
 * frontend-v2 specs 정책 추적 주석 검증 스크립트 (경고 전용 — 항상 exit 0)
 *
 * 검사 1) 커밋 대상 frontend-v2/src 파일 중 specs 구현 정책 주석(specs/*.md 마커)이 없는 파일
 * 검사 2) specs/*.md 의 모든 정책 ID가 코드에서 참조되는지 (커버리지 누락)
 *
 * 사용: node scripts/check-spec-annotations.mjs [파일경로...] | --all
 *      - 인자가 없으면 git staged 파일 기준으로 검사한다
 *      - 정책과 무관한 파일(유틸/리소스 등)은 경고를 무시해도 된다
 */
import { execSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const SRC_DIR = "packages/frontend-v2/src";
const SPECS_DIR = "packages/frontend-v2/specs";
/** 파일 상단 주석에 반드시 있어야 하는 마커: "specs/home.md" 같은 문서 경로 참조 */
const ANNOTATION_MARKER = /specs\/[a-z-]+\.md/;
/** 파일에 포함된 정책 ID 참조 (예: search-006, card-001/002 범위 표기 포함) */
const RANGE_ID_PATTERN = /\b([a-z]+)-(\d+)\s*\/\s*(\d+)\b/gi;
const SINGLE_ID_PATTERN = /\b([a-z]+-\d+)\b/gi;
const EXCLUDED = [/\.test\.(ts|tsx)$/, /\.d\.ts$/];

const isSourceFile = (file) => /\.(ts|tsx)$/.test(file) && !EXCLUDED.some((p) => p.test(file));

function listFiles(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = join(dir, entry.name);
    return entry.isDirectory() ? listFiles(full) : [full];
  });
}

function getStagedFiles() {
  try {
    return execSync("git diff --cached --name-only --diff-filter=ACMR", {
      encoding: "utf8",
    })
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
  } catch {
    return [];
  }
}

/** specs/*.md 에서 정책 ID 목록 추출 ("- search - 006: ..." → "search-006") */
function parseSpecPolicyIds() {
  const files = listFiles(SPECS_DIR).filter((file) => file.endsWith(".md"));
  const ids = new Set();
  for (const file of files) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(/^-\s*([A-Za-z]+)\s*-\s*(\d+)\s*:/gm)) {
      ids.add(`${match[1].toLowerCase()}-${match[2]}`);
    }
  }
  return [...ids].sort();
}

/** 코드 전체에서 참조된 정책 ID 수집 (card-001/002 같은 범위 표기는 펼쳐서 계산) */
function collectReferencedIds() {
  const ids = new Set();
  for (const file of listFiles(SRC_DIR).filter(isSourceFile)) {
    const content = readFileSync(file, "utf8");
    for (const match of content.matchAll(RANGE_ID_PATTERN)) {
      const [, prefix, from, to] = match;
      const width = from.length;
      for (let n = Number(from); n <= Number(to); n += 1) {
        ids.add(`${prefix.toLowerCase()}-${String(n).padStart(width, "0")}`);
      }
    }
    for (const match of content.matchAll(SINGLE_ID_PATTERN)) {
      ids.add(match[1].toLowerCase());
    }
  }
  return ids;
}

const args = process.argv.slice(2);
const checkAll = args.includes("--all");
const explicitFiles = args.filter((arg) => arg !== "--all");

let targets;
if (explicitFiles.length > 0) {
  targets = explicitFiles;
} else if (checkAll) {
  targets = listFiles(SRC_DIR);
} else {
  targets = getStagedFiles().filter((file) => file.startsWith(SRC_DIR));
}

const warnings = [];

// 검사 1: 주석 누락 (검사 대상 파일이 있을 때만)
for (const file of targets.filter(isSourceFile)) {
  try {
    const content = readFileSync(file, "utf8");
    if (!ANNOTATION_MARKER.test(content)) {
      warnings.push(`  - ${file}: specs 구현 정책 주석이 없습니다 (정책 구현/수정 파일이라면 상단에 specs/*.md 주석을 추가하세요)`);
    }
  } catch {
    // 읽을 수 없는 파일(삭제 중 등)은 건너뜀
  }
}

// 검사 2: 정책 커버리지 (specs에 정의된 정책이 코드 어디에도 참조되지 않을 때)
const specIds = parseSpecPolicyIds();
const referencedIds = collectReferencedIds();
const uncovered = specIds.filter((id) => !referencedIds.has(id));
for (const id of uncovered) {
  warnings.push(`  - 정책 ${id}: 코드에서 참조하는 곳이 없습니다 (구현 누락 또는 주석 누락)`);
}

if (warnings.length > 0) {
  console.warn("⚠️  specs 정책 주석 경고 (커밋은 계속 진행됩니다):");
  console.warn(warnings.join("\n"));
  console.warn("정책과 무관한 파일(유틸/리소스 등)의 경고는 무시해도 됩니다.");
} else if (targets.length > 0) {
  console.log("✅ specs 정책 주석 검사 통과");
} else {
  console.log("✅ specs 주석 검사: 커밋 대상 frontend-v2/src 파일 없음 (정책 커버리지는 검사 완료)");
}

process.exit(0);
