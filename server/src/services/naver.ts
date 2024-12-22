import { Service } from "typedi";
import request from "request-promise-native";

import ModelService from "./core/model";

import { wait } from "../utils/time";

@Service()
export default class NaverService {
  constructor(private readonly modelService: ModelService) {}

  public async local() {
    try {
      const data = await request({
        uri: "https://new.land.naver.com/api/regions/list?cortarNo=0000000000",
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }).then((res) => {
        const { regionList = [] } = JSON.parse(res);

        return regionList;
      });

      return data;
    } catch (error) {}
  }

  public async region() {
    const localAll = await this.modelService.excute({
      sql: "SELECT * FROM areleme.local WHERE type='naver'",
      type: "all",
    });

    const res: { [key: string]: [] } = {};

    for await (const row of localAll) {
      const data = await request({
        uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }).then((res) => {
        const { regionList = [] } = JSON.parse(res); // regionList
        return regionList;
      });

      res[row.code] = data;
    }

    return res;
  }

  public async dong() {
    const regionAll = await this.modelService.excute({
      sql: "SELECT * FROM areleme.region WHERE type='naver'",
      type: "all",
    });

    const dongs: any[] = [];

    for await (const row of regionAll) {
      await request({
        uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
        method: "GET",
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
        },
      }).then((res) => {
        const { regionList = [] } = JSON.parse(res); // regionList
        regionList.forEach((item: any) => {
          dongs.push({
            ...item,
            localCode: row.localCode,
            regionCode: row.code,
          });
        });
      });

      await wait(1500);
    }

    console.log(dongs);

    return dongs;
  }
}
