import convert, { ElementCompact } from "xml-js";

const test = async () => {
  const apiurl =
    "http://www.kopis.or.kr/openApi/restful/pblprfr/PF272732?service=060f382bc46846d6bbe9d415b701af77";

  const response: ElementCompact = await fetch(apiurl)
    .then((res) => res.text())
    .then((data) => convert.xml2js(data, { compact: true }));

  console.log(response);
};

const test2 = async () => {
  const apiurl =
    "https://kopis.or.kr/openApi/restful/boxoffice?service=060f382bc46846d6bbe9d415b701af77&stdate=20250710&eddate=20250716&catecode=CCCA";

  const response: ElementCompact = await fetch(apiurl)
    .then((res) => res.text())
    .then((data) => convert.xml2js(data, { compact: true }));

  console.log(response);
};



for (let i = 0; i < 100; i++) {
  test2();
}
