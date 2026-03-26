export interface ProgramMatchResult {
  composer: string | null;
  piece: string | null;
  highlight: "composer" | "piece";
}