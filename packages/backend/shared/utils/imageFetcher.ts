import { APIError, withErrorHandling } from "./error";

export const imageFetcher = async (url: string, message: string) => {
  const response = await fetch(url);

  if (!response.ok) {
    throw new APIError(message);
  }

  return Buffer.from(await response.arrayBuffer());
};
