import supabase from "@/apis/supabase-client";
import { API_URL, SERVICE_KEY } from "@/apis/kopis-client";
import { ElementCompact } from "xml-js";
import convert from "xml-js";

interface ConcertHallLocationType {
  [key: string]: any;
}

const importConcertHallLocationData = async (
  locationData: ConcertHallLocationType
) => {
  const { data, error } = await supabase
    .from("concert_halls")
    .insert(locationData)
    .select();

  if (error) {
    console.log("DB에 공연장 위치 데이터 삽입 실패", error);
  } else {
    console.log("DB에 공연장 위치 데이터 삽입 성공", data);
  }
};

const fetchAndImportConcertHallLocationData = async () => {
  const startConcertHallID = 3;
  const endConcertHallId = 4496;

  for (let id = startConcertHallID; id <= endConcertHallId; id++) {
    const locationAPI = `${API_URL}/prfplc/FC${String(id).padStart(
      6,
      "0"
    )}?service=${SERVICE_KEY}`;

    const response: ElementCompact = await fetch(locationAPI)
      .then((res) => res.text())
      .then((data) => convert.xml2js(data, { compact: true }));

    const { fcltynm, mt10id, adres, la, lo } = response.dbs.db;
    const concertHallLocationData = Object.fromEntries(
      Object.entries({ fcltynm, mt10id, adres, la, lo }).map(([key, value]) => {
        if (!value) {
          return [key, null];
        }
        return [key, value._text];
      })
    );

    await importConcertHallLocationData(concertHallLocationData);
  }
};

fetchAndImportConcertHallLocationData();
