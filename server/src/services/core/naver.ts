import { Service } from 'typedi';
import request from 'request-promise-native';

import ModelService from '../model/model';
import config from '../../config';

import { wait } from '../../utils/time';
import { empty } from '../../utils/valid';

/**
 *       cortarNo: dong, // * dong [code]
      priceType: 'RETAIL', // ??
      realEstateType: 'APT:PRE', // ??
      tradeType: '', // * 거래유형 (EX : A1:B2)
      priceMin: 0, // * 최소가격
      priceMax: 0, // * 최대가격
      rentPriceMin: 0, // * 최소가격 (월세)
      rentPriceMax: 0, // * 최대가격 (월세)
      areMin: 0, // * 최소면적
      areMax: 0, // * 최대면적
 */
type ComplexesQs = {
  cortarNo: string;
  priceType: string;
  realEstateType: string;
  tradeType: string;
  priceMin: number;
  priceMax: number;
  rentPriceMin: number;
  rentPriceMax: number;
  areaMin: number;
  areaMax: number;
  order?: string;
};

@Service()
export default class NaverService {
  constructor(private readonly modelService: ModelService) {}

  public async fetchLocal() {
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

  public async fetchRegion() {
    const localAll = await this.modelService.execute({
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

  public async fetchDong() {
    const regionAll = await this.modelService.execute({
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

  public async fetchComplexes(qs: ComplexesQs) {
    return await request({
      uri: `https://new.land.naver.com/api/regions/complexes`,
      method: 'GET',
      qs: qs,
      headers: this.getHeaders(),
    }).then((res) => {
      const data = JSON.parse(res);

      return data.complexList;
    });
  }

  /**
   *
   * 아파트 & 오피스텔 정보를 불러오는 API ...
   *
   * * https://new.land.naver.com/api/articles?cortarNo=3020015200 // 원룸 투룸 & 상가 토지 & 빌라 주택은 해당 URL을 사용합니다
   */
  public async fetchComplexDetails(complexNo: string, qs: ComplexesQs) {
    return await request({
      uri: `https://new.land.naver.com/api/articles/complex/${complexNo}`,
      method: 'GET',
      qs: {
        // 쿼리 스트링을 객체로 전달
        ...qs,
        complexNo: complexNo,
      },
      headers: this.getHeaders(),
    }).then((res) => {
      const data = JSON.parse(res);

      return data.articleList;
    });
  }

  /**
   * https://api.ncloud-docs.com/docs/ai-naver-mapsreversegeocoding-gc
   */
  public async fetchLocationToGeocode(lat: number, lng: number) {
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

  public async fetchNowLastEstate(params: any) {}

  public async getLocals() {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.naver_local a WHERE 1`,
      type: 'all',
    });
  }

  public async getLocal(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.naver_local a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }

  public async getRegionsOfLocal(localCode: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.naver_region a WHERE a.localCode = '${localCode}'`,
      type: 'all',
    });
  }

  public async getDongsOfRegion(regionCode: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.naver_dong a WHERE a.regionCode = '${regionCode}'`,
      type: 'all',
    });
  }

  public async getDong(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.naver_dong a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }

  /**
   * 네이버 부동산 쿼리에 맞게 Setting을 변경합니다.
   * 
   * [1] {
[1]   estateType: 'apt',
[1]   tradeType: 'sell',
[1]   local: '1100000000',
[1]   region: '1174000000',
[1]   dong: '1174010200',
[1]   details: {
[1]     cost: [ 0, 1000000001 ],      
[1]     rentCost: [ 100000, 2000000 ],
[1]     pyeong: [ 10, 61 ]
[1]   },
[1]   selectCodes: [ 'talk' ],        
[1]   inputs: { sms: '01056539944' }  
[1] }
   */
  public converyToQuery({ estateType, tradeType, dong, details }: any) {
    const tradeTypeVo: any = {
      sell: 'A1', // 매매,
      lease: 'B1', // 전세,
      monthlyRent: 'B2', // 월세
    };

    const qs: ComplexesQs = {
      cortarNo: dong, // * dong [code]
      priceType: 'RETAIL', // ??
      realEstateType: '', // ??
      tradeType: '', // * 거래유형 (EX : A1:B2)
      priceMin: 0, // * 최소가격
      priceMax: 0, // * 최대가격
      rentPriceMin: 0, // * 최소가격 (월세)
      rentPriceMax: 0, // * 최대가격 (월세)
      areaMin: 0, // * 최소면적
      areaMax: 0, // * 최대면적
    };

    qs.tradeType = tradeTypeVo[tradeType];

    qs.priceMin = details.cost[0] === 0 ? 0 : details.cost[0];
    qs.priceMax = details.cost[1] === 1000000001 ? 900000000 : details.cost[1];

    qs.rentPriceMin = details.rentCost[0] === 100000 ? 1 : details.rentCost[0];
    qs.rentPriceMax = details.rentCost[1] === 2000000 ? 900000000 : details.rentCost[1];

    qs.areaMin = details.pyeong[0] === 10 ? 0 : details.pyeong[0];
    qs.areaMax = details.pyeong[1] === 61 ? 900000000 : details.pyeong[1];

    return qs;
  }

  private getHeaders() {
    return {
      authorization:
        'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IlJFQUxFU1RBVEUiLCJpYXQiOjE3MzM5OTE0MTgsImV4cCI6MTczNDAwMjIxOH0.OecLbUoVZtwQ-NAwfY0Jjz5DNxJg1Ai-76l1EVXe6BE',
      referer: 'https://new.land.naver.com/complexes/25256',
      'sec-ch-ua': '"Google Chrome";v="131", "Chromium";v="131", "Not_A Brand";v="24"',
      'sec-ch-ua-mobile': '?0',
      'sec-ch-ua-platform': '"Windows"',
      'sec-fetch-dest': 'empty',
      'sec-fetch-mode': 'cors',
      'sec-fetch-site': 'same-origin',
      'user-agent':
        'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
    };
  }
}
