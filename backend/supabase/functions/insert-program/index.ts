import supabase from "../_shared/supabaseClient.ts";
import getProgramJSON from "./get-program";
import { TextNode } from "../_shared/types/common.d.ts";

interface ProgramType {
  composer?: string;
  title?: string[];
  era?: string;
  genre?: string;
}

const insertProgramDataToDB = async (
  pfCode: TextNode,
  program: ProgramType[]
) => {
  const { error } = await supabase
    .from("performance_list")
    .update({ program })
    .eq("mt20id", JSON.stringify(pfCode));

  if (error) {
    console.log("프로그램 데이터 performnace_list에 삽입 실패", error);
  } else {
    console.log("프로그램 데이터 performnace_list에 삽입 성공");
  }
};

const getUniqueProgram = (program: ProgramType[]) => {
  if (program.length >= 2) {
    let left = 0;
    while (0 <= left && left <= program.length - 2) {
      if (!program[left].composer || !program[left].title) {
        left++;
      } else {
        let right = left + 1;
        while (left < right && right <= program.length - 1) {
          if (
            program[left].title &&
            program[right].composer &&
            program[right].title &&
            program[left].composer === program[right].composer
          ) {
            // 같은 작곡가라면 작품명 병합
            program[left].title!.push(...program[right].title!);
            program.splice(right, 1);
          } else {
            right++;
          }
        }
        left++;
      }
    }
  }

  return program;
};

const normalizeName = (name: string) => {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^A-Za-z\s-]/g, "");
};

export const getRankingDataProgramInfo = async () => {
  const { data: pfCodeAndImgUrlArray, error } = await supabase
    .from("performance_list")
    .select("mt20id, styurls");

  if (error) {
    console.log("performance_list에서 styurls 받아오기 실패", error);
  } else {
    for (const item of pfCodeAndImgUrlArray) {
      console.log(item);
      const detailImg = item.styurls.styurl;

      const detailImgURL = Array.isArray(detailImg)
        ? detailImg[detailImg.length - 1]._text
        : detailImg._text;

      const t1 = performance.now();
      const program = await getProgramJSON(detailImgURL);
      const uniqueProgram = getUniqueProgram(program);

      // 작곡가명에서 악센트 및 특수문자 제거
      for (const item of uniqueProgram) {
        if (item.composer) {
          item.composer = normalizeName(item.composer);
        }
      }

      await insertProgramDataToDB(item.mt20id, program);
      const t2 = performance.now();

      if (t2 - t1 < 4000) {
        // 분당 15회 요청수 제한 -> 요청 1개 4초마다
        await new Promise((r) => {
          setTimeout(() => {
            r(1);
          }, 4000 - (t2 - t1));
        });
      }
    }
    return;
  }
};

getRankingDataProgramInfo();
