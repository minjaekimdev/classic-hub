type DateType = "korean" | "dot" | "slash" | "dash" | "simple";
const TEMPLATE_MAP = {
  korean: "YYYY년 MM월 DD일",
  dot: "YYYY.MM.DD",
  slash: "YYYY/MM/DD",
  dash: "YYYY-MM-DD",
  simple: "YYYYMMDD",
};

const DateTransformer = {
  normalize: (input: string) => {
    const result = input.replace(/\D/g, "");
    return result;
  },

  parse: (input: string): Record<string, string> => {
    return {
      YYYY: input.slice(0, 4),
      MM: input.slice(4, 6),
      DD: input.slice(6, 8),
    };
  },

  // 3. 최종 출력 (템플릿 기반)
  format: (input: string, type: DateType) => {
    const normalized = DateTransformer.normalize(input);
    const parsed = DateTransformer.parse(normalized);

    return TEMPLATE_MAP[type].replace(/YYYY|MM|DD/g, (match) => parsed[match]);
  },
};

export default DateTransformer;