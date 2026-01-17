import { APIError } from "utils/error";
import convert, { ElementCompact } from "xml-js";

export const kopisFetcher = async (api: string) => {
  const response = await fetch(api);

  // HTTP 에러일 경우 
  if (!response.ok) {
    throw new APIError(
      "KOPIS API request failed!",
      response.status
    );
  }

  const xmlText = await response.text();
  const parsedData: ElementCompact = convert.xml2js(xmlText, {
    compact: true,
  });

  return parsedData;
};
