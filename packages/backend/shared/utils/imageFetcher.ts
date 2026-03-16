import { APIError, withErrorHandling } from "./error";

export const imageFetcher = async (url: string, message: string) => {
  return withErrorHandling(
    async () => {
      const response = await fetch(url);

      if (!response.ok) {
        throw new APIError(message);
      }

      return Buffer.from(await response.arrayBuffer());
    },
    null,
    "kopis",
  );
};
