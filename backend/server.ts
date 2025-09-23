import express, { Express, Request, Response } from "express";
import supabase from "./apis/supabase-client";
import cors from "cors";
import { RankingItem } from "./models/ranking-server";

const app: Express = express();
const PORT = 3000;

app.use(cors());

// 랭킹 정보 반환
app.get("/ranking/:period", async (req: Request, res: Response) => {
  const rankingPeriod = req.params;
  const tableName = `${rankingPeriod.period}_ranking`;

  const { data, error } = await supabase
    .from(tableName)
    .select("rnum, prfnm, prfpd, prfplcnm, poster, mt20id, relates");


  if (error) {
    return res.status(500).json({ error: error.message });
  } else {
    data.sort((a, b) => a.rnum._text - b.rnum._text);
    return res.status(200).json(data);
  }
});

// 공연 상세 정보 반환
app.get("/detail/:mt20id", async (req: Request, res: Response) => {
  const pfId = req.params;

  const { data, error } = await supabase
    .from("performance_list")
    .select(
      "prfnm, prfpdfrom, prfpdto, fcltynm, poster, prfstate, prfruntime, prfage, pcseguidance, mt10id, dtguidance, styurls, relates"
    )
    .eq("mt20id", JSON.stringify({ _text: pfId.mt20id }))
    .limit(1)
    .single();

  if (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  } else {
    const item = data as { [key: string]: any };
    Object.keys(data).forEach((key) => {
      item[key] = JSON.parse(item[key]);
    });

    return res.status(200).json(item);
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
