import { Service } from 'typedi';
import request from 'request-promise-native';

import ModelService from './core/model';

import { wait } from '../utils/time';
import config from '../config';

@Service()
export default class NaverService {
  constructor(private readonly modelService: ModelService) {}

  public async local() {
    try {
      const data = await request({
        uri: 'https://new.land.naver.com/api/regions/list?cortarNo=0000000000',
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
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
      sql: 'SELECT * FROM areleme.naver_local',
      type: 'all',
    });

    const regions: any[] = [];

    for await (const row of localAll) {
      await request({
        uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
        },
      }).then((res) => {
        const { regionList = [] } = JSON.parse(res); // regionList
        regionList.forEach((item: any) => {
          regions.push({
            ...item,
            localCode: row.code,
          });
        });
      });
    }

    return regions;
  }

  public async dong() {
    const regionAll = await this.modelService.excute({
      sql: 'SELECT * FROM areleme.naver_region',
      type: 'all',
    });

    const dongs: any[] = [];

    for await (const row of regionAll) {
      await request({
        uri: `https://new.land.naver.com/api/regions/list?cortarNo=${row.code}`,
        method: 'GET',
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36',
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

    return dongs;
  }

  /**
   * https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc
   */
  public async searchLocation(lat: number, lng: number) {
    const locations = await request(
      `https://naveropenapi.apigw.ntruss.com/map-reversegeocode/v2/gc?coords=${lng}%2C${lat}&output=json&orders=legalcode%2Cadmcode%2Caddr%2Croadaddr`,
      {
        headers: {
          'X-NCP-APIGW-API-KEY-ID': config.naver.secret_key, // Naver API Key ID
          'X-NCP-APIGW-API-KEY': config.naver.access_key, // Naver API Key
        },
      },
    ).then((res) => {
      const { results } = JSON.parse(res);

      return results;
    });

    return locations;
  }

  public async login() {}
}
