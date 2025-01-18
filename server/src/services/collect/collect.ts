import { Service } from 'typedi';

import DabangService from '../platform/dabang';
import NaverService from '../platform/naver';
import ZigbangService from '../platform/zigbang';
import ModelService from '../model/model';

import { empty } from '../../utils/valid';

import request from 'request-promise-native';

@Service()
export default class CollectService {
  constructor(
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly zigbangService: ZigbangService,
    private readonly modelService: ModelService,
  ) {}

  public async saveNaverLocal() {
    const data = await this.naverService.fetchLocal();

    const list = data.map((item: any) => ({
      code: item.cortarNo,
      lat: item.centerLat,
      lng: item.centerLon,
      name: item.cortarName,
    }));

    for await (const row of list) {
      const localRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.naver_local WHERE code = '${row.code}'`,
        type: 'row',
      });

      if (empty(localRow)) {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.naver_local',
          data: row,
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      } else {
        console.log(`이미 존재하는 Local입니다. (네이버) ❗`, row);
      }
    }
  }

  public async saveNaverRegion() {
    const data = await this.naverService.fetchRegion();
    const list = data.map((item) => {
      return {
        code: item.cortarNo,
        lat: item.centerLat,
        lng: item.centerLon,
        name: item.cortarName,
        localCode: item.localCode,
      };
    });

    for await (const row of list) {
      const regionRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.naver_region WHERE code = '${row.code}' AND localCode = '${row.localCode}'`,
        type: 'row',
      });

      if (empty(regionRow)) {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.naver_region',
          data: {
            ...row,
          },
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      } else {
        console.log(`이미 존재하는 Region입니다. (네이버) ❗`, row);
      }
    }
  }

  public async saveNaverDong() {
    const data = await this.naverService.fetchDong();
    const list = data.map((item) => {
      return {
        code: item.cortarNo,
        lat: item.centerLat,
        lng: item.centerLon,
        name: item.cortarName,
        localCode: item.localCode,
        regionCode: item.regionCode,
      };
    });

    for await (const row of list) {
      const regionRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.naver_dong WHERE code = '${row.code}' AND localCode = '${row.localCode}' AND regionCode = '${row.regionCode}'`,
        type: 'row',
      });
      if (empty(regionRow)) {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.naver_dong',
          data: {
            ...row,
            localCode: row.localCode,
            regionCode: row.regionCode,
          },
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      } else {
        console.log(`이미 존재하는 Dong입니다. (네이버)❗`, row);
      }
    }
  }

  public async saveDabangLocal() {
    const data = await this.dabangService.fetchLocal();

    const list = data.map((item: any) => ({
      code: item.code,
      lat: item.location.lat,
      lng: item.location.lng,
      nLat: item.nextCenter.lat,
      nLng: item.nextCenter.lng,
      name: item.name,
    }));

    for await (const row of list) {
      const localRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_local WHERE code = '${row.code}'`,
        type: 'row',
      });

      if (empty(localRow)) {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.dabang_local',
          data: {
            ...row,
          },
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      } else {
        console.log(`이미 존재하는 Local입니다. (다방)❗`, row);
      }
    }
  }

  /**
   * {
[1]     code: '47190',
[1]     name: '구미시',
[1]     location: { lat: 36.21153399457331, lng: 128.34841807148308 },
[1]     nextCenter: { lat: 36.21153399457331, lng: 128.34841807148308 },
[1]     nextZoom: 13,
[1]     formatSellingType: '매',
[1]     formatAveragePrice: '1.3억',
[1]     isPopular: true,
[1]     realTimeWatchCount: 0,
[1]     contents: {
[1]       pyeongPrice: 438,
[1]       gapPrice: 3547,
[1]       leasePriceRate: null,
[1]       floorAreaRatio: 41,
[1]       buildingCoverageRatio: 240,
[1]       useApprovalYear: null,
[1]       hou
   */
  public async saveDabangRegion() {
    const regions = await this.dabangService.fetchRegion();
    const list = [];

    /**
     * !문제점
     * * row.name : 서구,중구,동구
     * * 부산광역시 동구, 대전광역시 동구 등등등.. 중복되는 Local이 존재한다
     * * 이게 어떤 Local의 영속되어있는 Region인지 판단 불가
     */
    for await (const row of regions) {
      const naverRegion = await this.modelService.execute({
        sql: `SELECT * FROM areleme.naver_region a WHERE a.name='${row.name}'`,
        type: 'row',
      });

      // * 무조건 네이버부동산 기준으로
      if (empty(naverRegion)) {
        console.log(`name : ${row.name}❌`);
        continue;
      }

      const addressInfos = await this.naverService.fetchLocationToGeocode(row.location.lat, row.location.lng);
      const address = addressInfos[0]?.region?.area1 || {};

      const dabangLocal = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_local WHERE name = '${address.name}'`,
        type: 'row',
      });

      if (empty(dabangLocal)) {
        console.log(`존재하지 않는 지역구입니다 EX) 서구,중구,동구 등`, row);
        continue;
      }

      list.push({
        code: row.code,
        localCode: dabangLocal.code,
        lat: row.location.lat,
        lng: row.location.lng,
        nLat: row.nextCenter.lat,
        nLng: row.nextCenter.lng,
        name: row.name,
      });
    }

    for await (const row of list) {
      const regionRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_region WHERE code = '${row.code}' AND localCode='${row.localCode}'`,
        type: 'row',
      });

      if (!empty(regionRow)) {
        console.log(`이미 존재하는 Region입니다. (다방)❗`, row.name);
      } else {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.dabang_region',
          data: {
            ...row,
          },
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      }
    }
  }

  /**
   * 현재 매물이 없는 동일 경우
   * 위치를 제공 하지 않음..
   *
   */
  public async saveDabangDong() {
    const dongs = await this.dabangService.fetchDong();

    for await (const row of dongs) {
      const naverDong = await this.modelService.execute({
        sql: `SELECT * FROM areleme.naver_dong a WHERE a.name='${row.name}'`,
        type: 'row',
      });

      // * 무조건 네이버부동산 기준으로
      if (empty(naverDong)) {
        console.log(`name : ${row.name}❌`);
        continue;
      }

      const addressInfos = await this.naverService.fetchLocationToGeocode(row.location.lat, row.location.lng);
      const localName = addressInfos[0]?.region?.area1?.name || '';
      const regionName = addressInfos[0]?.region?.area2?.name || '';
      const dongName = addressInfos[0]?.region?.area3?.name || '';

      const localRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_local WHERE name = '${localName}'`,
        type: 'row',
      });

      if (empty(localRow)) {
        console.log(`존재하지 않는 시입니다 EX) 대전광역시,서울특별시 등`, row.name, row.location);
        continue;
      }

      const regionRow = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_region WHERE name = '${regionName}'`,
        type: 'row',
      });

      if (empty(regionRow)) {
        console.log(`존재하지 않는 지역구입니다 EX) 서구,중구,동구 `, regionName, row.name, row.location);
        continue;
      }

      const dabangDong = await this.modelService.execute({
        sql: `SELECT * FROM areleme.dabang_dong WHERE code = '${row.code}' AND localCode = '${localRow.code}' AND regionCode = '${regionRow.code}'`,
        type: 'row',
      });

      if (!empty(dabangDong)) {
        console.log(`이미 존재하는 Dong입니다. (다방)❗`, row.name);
      } else {
        const insertQuery = this.modelService.getInsertQuery({
          table: 'areleme.dabang_dong',
          data: {
            localCode: localRow.code,
            regionCode: regionRow.code,
            code: row.code,
            lat: row.location.lat,
            lng: row.location.lng,
            name: row.name,
          },
        });

        await this.modelService.execute({
          sql: insertQuery,
          type: 'exec',
          debug: false,
        });
      }
    }
  }
}
