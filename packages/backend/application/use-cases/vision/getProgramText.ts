import ocr from "@/infrastructure/external-api/vision";

const getProgramText = async (image: Buffer) => {
  const [result] = await ocr.textDetection(image);

  return result.fullTextAnnotation?.text || "";
};

export default getProgramText;