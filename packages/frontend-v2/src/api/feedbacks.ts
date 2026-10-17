import supabase from "@/api/supabase";
import type { Concert } from "@/types/concert";

const FEEDBACKS_TABLE = "feedbacks";

export interface ServiceFeedbackInput {
  topic: string;
  rating: string;
  content: string;
  email?: string;
}

export interface ProgramReportInput {
  concert: Concert;
  details: string;
  referenceUrl?: string;
  email?: string;
}

export const buildServiceFeedbackContent = ({
  topic,
  rating,
  content,
}: Pick<ServiceFeedbackInput, "topic" | "rating" | "content">): string =>
  `[서비스 피드백] 주제: ${topic} / 만족도: ${rating}\n\n${content.trim()}`;

export const buildProgramReportContent = ({
  concert,
  details,
  referenceUrl,
}: Pick<ProgramReportInput, "concert" | "details" | "referenceUrl">): string => {
  const programSummary = concert.programs
    .flatMap((program) => program.titles.map((title) => title.ko ?? title.en))
    .filter((title): title is string => title !== null)
    .join(" / ");

  return [
    "[프로그램 오류 제보]",
    `공연: ${concert.name} (${concert.id})`,
    `기간: ${concert.periodFrom} ~ ${concert.periodTo}`,
    `장소: ${concert.venueName}`,
    programSummary ? `등록된 프로그램: ${programSummary}` : null,
    referenceUrl ? `참고 링크: ${referenceUrl.trim()}` : null,
    "---",
    details.trim(),
  ]
    .filter((line): line is string => line !== null)
    .join("\n");
};

export const submitServiceFeedback = async (input: ServiceFeedbackInput): Promise<void> => {
  const { error } = await supabase.from(FEEDBACKS_TABLE).insert({
    email: input.email?.trim() || null,
    content: buildServiceFeedbackContent(input),
  });
  if (error) {
    throw new Error(error.message);
  }
};

export const submitProgramReport = async (input: ProgramReportInput): Promise<void> => {
  const { error } = await supabase.from(FEEDBACKS_TABLE).insert({
    email: input.email?.trim() || null,
    content: buildProgramReportContent(input),
  });
  if (error) {
    throw new Error(error.message);
  }
};
