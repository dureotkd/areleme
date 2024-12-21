import express, { Request, Response } from "express";
import requestNative from "request-promise-native";
import cors from "cors";
import puppeteer from "puppeteer";
import cheerio from "cheerio";

import ModelCore from "./core/model.js";

const request = requestNative.defaults({ jar: true });

const app = express();
const port = process.env.PORT || 4000;

app.use(
  cors({
    origin: "*",
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});

app.get("/", (req: Request, res: Response) => {
  res.send({
    title: "Hello World",
  });
});

/**
 * * http://localhost:4000/naver
 * * naver API 정리
 * - https://new.land.naver.com/api/regions/complexes?cortarNo=3020014700&realEstateType=APT%3APRE%3AABYG%3AJGC&order=
 * - cortarNo (동Code)
 * - 3020014700
 */
app.get("/naver", async (req: Request, res: Response) => {
  /**
   * * SUCCESS
   * * cortarNo (지번 동 합친 코드 같음.. 특정 위치) 근처에 있는 아파트 매물 목록을 반환합니다.
   * complexList": [
    {
      "complexNo": "25256",
      "complexName": "송강그린",
      "cortarNo": "3020014700",
      "realEstateTypeCode": "APT",
      "realEstateTypeName": "아파트",
      "detailAddress": "199",
      "latitude": 36.432199,
      "longitude": 127.382065,
      "totalHouseholdCount": 1830,
      "totalBuildingCount": 19,
      "highFloor": 15,
      "lowFloor": 15,
      "useApproveYmd": "19961030",
      "dealCount": 49,
      "leaseCount": 6,
      "rentCount": 3,
      "shortTermRentCount": 0,
      "cortarAddress": "대전시 유성구 송강동",
      "tourExist": false
    },
   */
  //   await request({
  //     uri: "https://new.land.naver.com/api/regions/complexes?cortarNo=3020014700",
  //     method: "GET",
  //     headers: {
  //       "User-Agent":
  //         "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
  //     },
  //   }).then((res) => {
  //     const data = JSON.parse(res);

  //     console.log(data);
  //   });

  /**
   * * SUCCESS
   * * complexNo를 도미엔 엔드포인트에 넣어주면 송강그린 아파트 매물 목록이 전부 나옵니다.
   * ! headers > authorization & referer 값을 정확히 넣어줘야합니다다
   */
  // await request({
  //   uri: "https://new.land.naver.com/api/articles/complex/25256",
  //   qs: {
  //     // 쿼리 스트링을 객체로 전달
  //     realEstateType: "APT:PRA:ABYG:JGC",
  //     tradeType: "",
  //     tag: "::",
  //     rentPriceMin: 0,
  //     rentPriceMax: 900000000,
  //     priceMin: 10000,
  //     priceMax: 30000,
  //     areaMin: 0,
  //     areaMax: 900000000,
  //     oldBuildYears: "",
  //     recentlyBuildYears: "",
  //     minHouseHoldCount: "",
  //     maxHouseHoldCount: "",
  //     showArticle: false,
  //     sameAddressGroup: false,
  //     minMaintenanceCost: "",
  //     maxMaintenanceCost: "",
  //     priceType: "RETAIL",
  //     directions: "",
  //     page: "1",
  //     complexNo: "25256",
  //     buildingNos: "",
  //     areaNos: "3",
  //     type: "list",
  //     order: "rank",
  //   },
  //   method: "GET", // 메서드를 GET으로 설정
  //   headers: {
  //     authorization:
  //       "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3MzM5OTE0MTgsImV4cCI6MTczNDAwMjIxOH0.OecLbUoVZtwQ-NAwfY0Jjz5DNxJg1Ai-76l1EVXe6BE",
  //     referer: "https://new.land.naver.com/complexes/25256",
  //     "sec-ch-ua":
  //       '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": '"Windows"',
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "user-agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  //   },
  // })
  //   .then((res) => {
  //     console.log(JSON.parse(res));
  //   })
  //   .catch((e) => {
  //     console.log(e);
  //   })
  //   .finally(() => {});

  res.send({});
});

/**
 * * http://localhost:4000/dabang
 * * dabang API 정리
 * * API 수집은 불가능 && 브라우저 자동화 도구 사용
 */
app.get("/dabang", async (req: Request, res: Response) => {
  // const browser = await puppeteer.launch({
  //   headless: false,
  // });

  // // 새로운 페이지 열기
  // const page = await browser.newPage();

  // // 원하는 URL로 이동
  // await page.goto(
  //   `https://www.dabangapp.com/map/apt?m_lat=36.3050403&m_lng=127.3458911&m_zoom=13`
  // );

  // // 페이지의 HTML 가져오기
  // const html = await page.content();
  // const $ = cheerio.load(html);

  // // ".styled__RoomItem-sc-1lx6b5d-0" 클래스를 가진 모든 li 요소를 선택
  // const elements = await page.$$(".styled__RoomItem-sc-1lx6b5d-0");

  // console.log(elements);

  // for (let index = 0; index < elements.length; index++) {
  //   const element = elements[index]; // 각 li 요소

  //   if (element) {
  //     try {
  //       // 요소를 PNG로 캡처하고 저장
  //       await element.screenshot({
  //         path: `element-${index}.png`, // 파일 경로 지정
  //         type: "png",
  //         fullPage: false, // 요소만 캡처
  //       });
  //       console.log(`Captured image of element ${index}`);

  //     } catch {}
  //   }
  // }

  // $("#apt-list")
  //   .find("ul > li")
  //   .each(async (index, ele) => {
  //     // Cheerio의 $에서 HTML 요소를 가져오고, Puppeteer에서 해당 요소를 선택
  //     // const element = await page.$(ele); // puppeteer로 요소를 선택
  //     const selector = $(ele).get(0).tagName.toLowerCase(); // 태그 이름을 얻어서 selector로 사용

  //     // Puppeteer에서 해당 요소를 선택
  //     const element = await page.$(".styled__RoomItem-sc-1lx6b5d-0"); // CSS selector를 사용해 Puppeteer에서 요소를 선택

  //     if (element) {
  //       // 요소를 PNG로 캡처하고 저장
  //       await element.screenshot({
  //         path: `element-${index}.png`, // 파일 경로 지정
  //         type: "png",
  //         fullPage: false, // 요소만 캡처
  //       });
  //       console.log(`Captured image of element ${index}`);
  //     }
  //   });

  // await request({
  //   url: "https://www.dabangapp.com/api/v5/markers/category/one-two",
  //   qs: {
  //     bbox: '{"sw":{"lat":36.1668355,"lng":126.8397204},"ne":{"lat":36.5969161,"lng":127.8271167}}',
  //     filters:
  //       '{"sellingTypeList":["MONTHLY_RENT","LEASE"],"depositRange":{"min":0,"max":11000},"priceRange":{"min":0,"max":999999},"isIncludeMaintenance":false,"pyeongRange":{"min":20,"max":59},"useApprovalDateRange":{"min":0,"max":999999},"roomFloorList":["GROUND_FIRST","GROUND_SECOND_OVER","SEMI_BASEMENT","ROOFTOP"],"roomTypeList":["ONE_ROOM","TWO_ROOM"],"dealTypeList":["AGENT","DIRECT"],"canParking":false,"isShortLease":false,"hasElevator":false,"hasPano":false,"isDivision":false,"isDuplex":false}',
  //     useMap: "naver",
  //     zoom: 11,
  //   },
  //   headers: {
  //     ":authority": "www.dabangapp.com",
  //     ":method": "GET",
  //     ":scheme": "https",
  //     accept: "application/json, text/plain, */*",
  //     "accept-encoding": "gzip, deflate, br, zstd",
  //     "accept-language": "ko-KR,ko;q=0.9,en-US;q=0.8,en;q=0.7",
  //     "cache-control": "no-cache",
  //     cookie:
  //       "_fwb=197sqskZRLrXFB71pV7D4tL.1734149047111; _fbp=fb.1.1734249080225.584441398513556368; _gid=GA1.2.1050745681.1734698875; wcs_bt=s_3d10ff175f87:1734765425; cto_bundle=...",
  //     csrf: "token",
  //     "d-api-version": "5.0.0",
  //     "d-app-version": "1",
  //     "d-call-type": "web",
  //     pragma: "no-cache",
  //     referer:
  //       "https://www.dabangapp.com/map/onetwo?depositRangeMax=11000&pyeongRangeMin=30&pyeongRangeMax=60&m_lat=36.3821731&m_lng=127.3334185&m_zoom=11",
  //     "sec-ch-ua":
  //       '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
  //     "sec-ch-ua-mobile": "?0",
  //     "sec-ch-ua-platform": '"Windows"',
  //     "sec-fetch-dest": "empty",
  //     "sec-fetch-mode": "cors",
  //     "sec-fetch-site": "same-origin",
  //     "user-agent":
  //       "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  //   },
  // }).then((res) => {
  //   console.log(res);
  // });

  const browser = await puppeteer.launch({
    headless: false,
  });
  const page = await browser.newPage();

  // 헤더 설정
  await page.setUserAgent(
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36"
  );

  // URL 이동 및 쿠키 가져오기
  await page.goto(
    "https://www.dabangapp.com/map/onetwo?depositRangeMax=11000&pyeongRangeMin=30&pyeongRangeMax=60&m_lat=36.3821731&m_lng=127.3334185&m_zoom=11"
  );

  // API 호출
  const data = await page.evaluate(async () => {
    const response = await fetch(
      "/api/v5/markers/category/one-two?bbox=%7B%22sw%22%3A%7B%22lat%22%3A36.1668355%2C%22lng%22%3A126.8397204%7D%2C%22ne%22%3A%7B%22lat%22%3A36.5969161%2C%22lng%22%3A127.8271167%7D%7D&filters=%7B%22sellingTypeList%22%3A%5B%22MONTHLY_RENT%22%2C%22LEASE%22%5D%2C%22depositRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A11000%7D%2C%22priceRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22isIncludeMaintenance%22%3Afalse%2C%22pyeongRange%22%3A%7B%22min%22%3A20%2C%22max%22%3A59%7D%2C%22useApprovalDateRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22roomFloorList%22%3A%5B%22GROUND_FIRST%22%2C%22GROUND_SECOND_OVER%22%2C%22SEMI_BASEMENT%22%2C%22ROOFTOP%22%5D%2C%22roomTypeList%22%3A%5B%22ONE_ROOM%22%2C%22TWO_ROOM%22%5D%2C%22dealTypeList%22%3A%5B%22AGENT%22%2C%22DIRECT%22%5D%2C%22canParking%22%3Afalse%2C%22isShortLease%22%3Afalse%2C%22hasElevator%22%3Afalse%2C%22hasPano%22%3Afalse%2C%22isDivision%22%3Afalse%2C%22isDuplex%22%3Afalse%7D&useMap=naver&zoom=11",
      {
        headers: {
          "d-api-version": "5.0.0",
          "d-call-type": "web",
          csrf: "token",
          accept: "application/json, text/plain, */*",
        },
      }
    );
    return await response.json();
  });

  console.log(data);

  // await browser.close();

  res.send({});
});

/**
 * * http://localhost:4000/soojip
 */
app.get("/soojip", async (req: Request, res: Response) => {
  /**
   * NAVER 시/구/동 수집
   *
   */
  const Model = new ModelCore();

  const all = await Model.excute({
    sql: "SELECT * FROM ban.game",
    type: "all",
  });

  res.send({});
});
