import { Service } from 'typedi';
import request from 'request-promise-native';

import ModelService from '../model/model';
import ComplexService from '../core/complex';
import SettingService from '../core/setting';
import EstateService from '../core/estate';
import AlarmService from '../core/alarm';
import RequestManagerService from '../utils/requestManager';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';

@Service()
export default class DabangService {
  constructor(
    private readonly debug: false,
    private readonly modelService: ModelService,
    private readonly requestManagerService: RequestManagerService,
    private readonly complexService: ComplexService,
    private readonly settingService: SettingService,
    private readonly estateService: EstateService,
    private readonly alarmService: AlarmService,
  ) {}

  public async fetchLocal() {
    const {
      result: { stateList },
    } = await request({
      uri: 'https://www.dabangapp.com/api/v5/markers/category/one-two?bbox=%7B%22sw%22%3A%7B%22lat%22%3A33.1460636%2C%22lng%22%3A121.5391567%7D%2C%22ne%22%3A%7B%22lat%22%3A38.9502276%2C%22lng%22%3A136.0356167%7D%7D&filters=%7B%22sellingTypeList%22%3A%5B%22MONTHLY_RENT%22%2C%22LEASE%22%5D%2C%22depositRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22priceRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22isIncludeMaintenance%22%3Afalse%2C%22pyeongRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22useApprovalDateRange%22%3A%7B%22min%22%3A0%2C%22max%22%3A999999%7D%2C%22roomFloorList%22%3A%5B%22GROUND_FIRST%22%2C%22GROUND_SECOND_OVER%22%2C%22SEMI_BASEMENT%22%2C%22ROOFTOP%22%5D%2C%22roomTypeList%22%3A%5B%22ONE_ROOM%22%2C%22TWO_ROOM%22%5D%2C%22dealTypeList%22%3A%5B%22AGENT%22%2C%22DIRECT%22%5D%2C%22canParking%22%3Afalse%2C%22isShortLease%22%3Afalse%2C%22hasElevator%22%3Afalse%2C%22hasPano%22%3Afalse%2C%22isDivision%22%3Afalse%2C%22isDuplex%22%3Afalse%7D&useMap=naver&zoom=9',
      method: 'GET',
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersDabang(),
    }).then((res) => {
      return JSON.parse(res);
    });

    return stateList;
  }

  public async fetchRegion() {
    const bbox = {
      sw: { lat: 31, lng: 123 },
      ne: { lat: 38, lng: 130 },
    };
    const filters = {
      sellingTypeList: ['MONTHLY_RENT', 'LEASE', 'SELL'],
      tradeRange: { min: 0, max: 999999 },
      depositRange: { min: 0, max: 999999 },
      priceRange: { min: 0, max: 999999 },
      isIncludeMaintenance: false,
      pyeongRange: { min: 0, max: 999999 },
      useApprovalDateRange: { min: 0, max: 999999 },
      dealTypeList: ['AGENT', 'DIRECT'],
      householdNumRange: { min: 0, max: 999999 },
      parkingNumRange: { min: 0, max: 999999 },
      isShortLease: false,
      hasTakeTenant: false,
    };

    const {
      result: { cityList },
    } = await request({
      uri: 'https://www.dabangapp.com/api/v5/markers/category/apt',
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersDabang(),
      qs: {
        bbox: JSON.stringify(bbox),
        filters: JSON.stringify(filters),
        useMap: 'naver',
        zoom: 11,
      },
      method: 'GET',
    }).then((res) => {
      return JSON.parse(res);
    });

    return cityList;
  }

  public async fetchDong() {
    const bbox = {
      sw: { lat: 29, lng: 120 },
      ne: { lat: 40, lng: 135 },
    };

    const filters = {
      sellingTypeList: ['MONTHLY_RENT', 'LEASE'],
      depositRange: { min: 0, max: 11000 },
      priceRange: { min: 0, max: 999999 },
      isIncludeMaintenance: false,
      pyeongRange: { min: 20, max: 59 },
      useApprovalDateRange: { min: 0, max: 999999 },
      roomFloorList: ['GROUND_FIRST', 'GROUND_SECOND_OVER', 'SEMI_BASEMENT', 'ROOFTOP'],
      roomTypeList: ['ONE_ROOM', 'TWO_ROOM'],
      dealTypeList: ['AGENT', 'DIRECT'],
      canParking: false,
      isShortLease: false,
      hasElevator: false,
      hasPano: false,
      isDivision: false,
      isDuplex: false,
    };

    const dongList = await request({
      uri: 'https://www.dabangapp.com/api/v5/markers/category/one-two',
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersDabang(),
      qs: {
        bbox: JSON.stringify(bbox),
        filters: JSON.stringify(filters),
        useMap: 'naver',
        zoom: 13,
      },
      method: 'GET',
    }).then((res) => {
      const data = JSON.parse(res);

      return data.result.dongList;
    });

    return dongList;
  }

  /**
   * 아파트 단지 정보를 불러오는 API
   */
  public async fetchComplexes(keyword: string) {
    return await request({
      uri: `https://www.dabangapp.com/api/3/loc/search-keyword`,
      method: 'GET',
      qs: {
        api_version: '3.0.1',
        call_type: 'web',
        keyword: keyword,
        limit: 25,
        version: 1,
      },
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersDabang(),
    }).then((res) => {
      const data = JSON.parse(res);
      return data.complex;
    });
  }

  /**
   * 아파트 단지의 Seq(일련번호)를 불러오는 API
   * @param complexNo
   * @returns
   */
  public async fetchSummary(complexNo: string) {
    try {
      const { code, msg, result } = await request({
        uri: `https://www.dabangapp.com/api/v5/complex/apt/summary`,
        method: 'GET',
        qs: {
          complexId: complexNo,
        },
        rejectUnauthorized: false, // SSL 인증서 `검증을 비활성화
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersDabang(),
      }).then((res) => {
        const data = JSON.parse(res);
        return data;
      });

      return result;
    } catch (error: any) {
      console.log('error.. fetch summary', error.message);

      return [];
    }
  }

  /**
   * 아파트 & 오피스텔 정보를 불러오는 API ...
   * * https://new.land.naver.com/api/articles?cortarNo=3020015200 // 원룸 투룸 & 상가 토지 & 빌라 주택은 해당 URL을 사용합니다
   */
  public async fetchComplexDetails(complexNo: string, qs: any) {
    const { spaceList } = await this.fetchSummary(complexNo);
    const spaceSeqList = spaceList.length > 0 ? spaceList.map((item: any) => item.spaceSeq) : [];
    qs.filters.spaceSeqList = spaceSeqList;

    try {
      return await request({
        uri: `https://www.dabangapp.com/api/v5/room-list/category/apt/complex`,
        method: 'GET',
        qs: {
          complexId: complexNo,
          filters: JSON.stringify(qs.filters),
          mainFilters: JSON.stringify(qs.mainFilters),
          order: 'LATEST',
          page: 1,
        },
        rejectUnauthorized: false, // SSL 인증서 `검증을 비활성화
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersDabang(),
      }).then((res) => {
        const {
          result: { roomList },
        } = JSON.parse(res);

        return roomList;
      });
    } catch (error) {
      console.log('error.. fetchComplexDetails');
    }
  }

  private async fetchOneTowRooms(dong: string, qs: any) {
    try {
      return await request({
        uri: 'https://www.dabangapp.com/api/v5/room-list/category/one-two/region',
        method: 'GET',
        qs: {
          code: dong,
          page: 1,
          useMap: 'naver',
          zoom: 14,
          filters: JSON.stringify(qs.mainFilters),
        },
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersDabang(),
      }).then((res) => {
        const {
          result: { roomList },
        } = JSON.parse(res);

        return roomList;
      });
    } catch (error: any) {
      console.log('error fetchOneTowRooms', error.message);
    }
  }

  private async fetchVillaJutaeks(dong: string, qs: any) {
    try {
      return await request({
        uri: 'https://www.dabangapp.com/api/v5/room-list/category/house-villa/region',
        method: 'GET',
        qs: {
          code: dong,
          page: 1,
          useMap: 'naver',
          zoom: 14,
          filters: JSON.stringify(qs.mainFilters),
        },
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersDabang(),
      }).then((res) => {
        const {
          result: { roomList },
        } = JSON.parse(res);

        return roomList;
      });
    } catch (error: any) {
      console.log('error fetchOneTowRooms', error.message);
    }
  }

  private async fetchOfficetels(dong: string, qs: any) {
    try {
      return await request({
        uri: 'https://www.dabangapp.com/api/v5/room-list/category/officetel/region',
        method: 'GET',
        qs: {
          code: dong,
          page: 1,
          useMap: 'naver',
          zoom: 14,
          filters: JSON.stringify(qs.mainFilters),
        },
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersDabang(),
      }).then((res) => {
        const {
          result: { roomList },
        } = JSON.parse(res);

        return roomList;
      });
    } catch (error: any) {
      console.log('error fetchOneTowRooms', error.message);
    }
  }

  /**
   * 
   * @param settingSeq [1] hello
[1] 4 {
[1]   estateType: 'apt',
[1]   tradeType: 'sell',
[1]   local: '1100000000',
[1]   region: '1168000000',
[1]   dong: '1168010300',
[1]   details: {
[1]     cost: [ 0, 1000000001 ],      
[1]     rentCost: [ 100000, 2000000 ],
[1]     pyeong: [ 10, 61 ]
[1]   },
[1]   selectCodes: [ 'email' ]        
[1] }
   * @param params 
   */
  public async initLastEstate(settingSeq: string, params: any) {
    const { local, region, dong, estateType } = params;
    const qs = this.convertToQuery(params);

    let estates = [];
    const nowDate = getNowDate();

    const dabangDongCode = this.convertDong(dong);

    switch (estateType) {
      case 'apt':
        const { localName, regionName, dongName } = await this.modelService.execute({
          sql: `SELECT 
            a.\`name\` AS localName , b.\`name\` AS regionName , c.\`name\` AS dongName 
          FROM 
            areleme.naver_local a,areleme.naver_region b,areleme.naver_dong c 
          WHERE 
            a.\`code\` = '${local}' AND b.\`code\` = '${region}' AND c.\`code\` = '${dong}'`,
          type: 'row',
        });

        const addressName = `${localName} ${regionName} ${dongName}`;

        const complexes = await this.fetchComplexes(addressName);

        // * APT ...
        if (!empty(complexes)) {
          for await (const {
            name,
            location: [lng, lat],
            complex_id,
          } of complexes) {
            const naverComplex = await this.complexService.getComplexCustomQuery({
              where: [`\`name\` = '${name}'`, `settingSeq = ${settingSeq}`],
              type: 'row',
            });

            if (empty(naverComplex)) {
              console.log(`Hello.. Naver complex empty ❌ : ${name}`);
              continue;
            }

            await this.complexService.updateComplex(
              {
                dno: complex_id,
                lat: lat,
                lng: lng,
              },
              [`seq = '${naverComplex.seq}'`],
            );

            const complexDetails = await this.fetchComplexDetails(complex_id, qs);

            if (empty(complexDetails)) {
              console.log(`complexDetails empty [${name}] 💢`);
              continue;
            }

            complexDetails[0].complexNo = complex_id;
            estates.push(complexDetails[0]);
          }
        } else {
          console.log(`empty complexes : ${addressName}`);
        }

        break;

      case 'one':
        estates = await this.fetchOneTowRooms(dabangDongCode, qs);

        if (estates.length > 1) {
          estates.splice(1);
        }

        break;

      case 'villa':
        estates = await this.fetchVillaJutaeks(dabangDongCode, qs);

        if (estates.length > 1) {
          estates.splice(1);
        }

        break;

      case 'op':
        estates = await this.fetchOfficetels(dabangDongCode, qs);

        if (estates.length > 1) {
          estates.splice(1);
        }

        break;
    }

    if (!empty(estates)) {
      for await (const { id, complexNo } of estates) {
        await this.modelService.execute({
          debug: this.debug,
          sql: this.modelService.getInsertQuery({
            table: 'areleme.last_estate',
            data: {
              settingSeq: settingSeq,
              articleNo: id,
              complexNo: complexNo,
              type: 'dabang',
              rDate: nowDate,
              eDate: nowDate,
            },
          }),
          type: 'exec',
        });
      }
    }
  }

  public async runNewEstate() {
    const settings = await this.settingService.getSettings();

    for await (const setting of settings) {
      const paramJson = JSON.parse(setting.params);
      const qs = this.convertToQuery(paramJson);

      switch (paramJson.estateType) {
        case 'apt':
          const complexes = await this.complexService.getComplexCustomQuery({
            where: [`settingSeq = '${setting.seq}'`, `dno IS NOT NULL`],
            type: 'all',
          });

          if (!empty(complexes)) {
            for await (const complex of complexes) {
              const lastEstate = await this.estateService.getLastEstateCustomQuery({
                where: [`settingSeq = '${setting.seq}'`, `complexNo = '${complex.dno}'`, `type = 'dabang'`],
                type: 'row',
              });

              const complexDetails = await this.fetchComplexDetails(complex.dno, qs);

              // console.log(`complexName:${complex.name} :: ${complexDetails.length} \n`);

              // if (complex.name === '향촌') {
              //   // console.log(naverQs);
              // }

              if (empty(complexDetails)) {
                continue;
              }

              const complexDetailList = complexDetails.map((item: any) => {
                return {
                  ...item,
                  articleNo: item.id,
                };
              });

              const findNewEstates: any = await this.estateService.findNewEstates(
                complexDetailList,
                lastEstate,
              );

              if (empty(findNewEstates)) {
                console.log(`새로운 매물이 존재하지 않습니다 :: ${complex.name} (${complex.no}) \n`);
                continue;
              }

              for await (const newEstate of findNewEstates) {
                const myEstateEntitiy = await this.convertToEstate(newEstate, paramJson.estateType);
                myEstateEntitiy.settingSeq = setting.seq;

                const estateSeq = await this.estateService.makeEstate(myEstateEntitiy);

                if (empty(estateSeq)) {
                  // ! DB ERROR
                  console.log(`매물 등록시 에러가 발생하였습니다`);
                  continue;
                }

                // * 알림 보내고
                const alarmRes = await this.alarmService.sendAlarm(estateSeq);

                if (empty(alarmRes)) {
                  // ! Alarm API ERROR
                  console.log(`알림 전송시 에러가 발생하였습니다`);
                  continue;
                }
              }
              const findLastEstate = findNewEstates[findNewEstates.length - 1];

              // /**
              //  * ? 테스트를 어떻게 할것인가..
              //  *
              //  * * 처음 Setting후 LastEstate가 Insert안됐지만
              //  * * 알림 전송 과정에서 발견하였을 경우!
              //  */
              if (!empty(lastEstate)) {
                // * UPDATE ...
                await this.estateService.updateLastEstate({
                  settingSeq: setting.seq,
                  articleNo: findLastEstate.articleNo,
                  complexNo: findLastEstate.complexNo,
                  type: 'dabang',
                });
              } else {
                // & INSERT ...
                await this.initLastEstate(setting.seq, qs);
              }
            }
          }

          break;

        case 'one':
        case 'villa':
        case 'op':
          let estates = [];

          const dabangDongCode = this.convertDong(paramJson.dong);

          if (paramJson.estateType == 'one') {
            estates = await this.fetchOneTowRooms(dabangDongCode, qs);
          } else if (paramJson.estateType == 'villa') {
            estates = await this.fetchVillaJutaeks(dabangDongCode, qs);
          } else if (paramJson.estateType == 'op') {
            estates = await this.fetchOfficetels(dabangDongCode, qs);
          }

          const lastEstate = await this.estateService.getLastEstateCustomQuery({
            where: [`settingSeq = '${setting.seq}'`, `type = 'dabang'`],
            type: 'row',
          });
          const findNewEstates: any = await this.estateService.findNewEstates(estates, lastEstate);

          if (empty(findNewEstates)) {
            console.log(`매물이 존재하지 않습니다 :: 원/투룸 \n`);
            continue;
          }

          for await (const newEstate of findNewEstates) {
            const myEstateEntitiy = await this.convertToEstate(newEstate, paramJson.estateType);
            myEstateEntitiy.settingSeq = setting.seq;

            const estateSeq = await this.estateService.makeEstate(myEstateEntitiy);

            if (empty(estateSeq)) {
              // ! DB ERROR
              console.log(`매물 등록시 에러가 발생하였습니다`);
              continue;
            }

            // * 알림 보내고
            const alarmRes = await this.alarmService.sendAlarm(estateSeq);

            if (empty(alarmRes)) {
              // ! Alarm API ERROR
              console.log(`알림 전송시 에러가 발생하였습니다`);
              continue;
            }
          }

          const findLastEstate = findNewEstates[findNewEstates.length - 1];

          // * UPDATE ...
          await this.estateService.updateLastEstate({
            settingSeq: setting.seq,
            articleNo: findLastEstate.articleNo,
            complexNo: findLastEstate.complexNo,
            type: 'dabang',
          });

          break;
      }
    }
  }

  private convertToQuery({ estateType, tradeType, dong, details }: any) {
    const tradeTypeVo: any = {
      sell: 'SELL', // 매매,
      lease: 'LEASE', // 전세,
      monthlyRent: 'MONTHLY_RENT', // 월세
    };

    /**
     * [1] {
[1]   filters: { sellingTypeList: [ 'SELL' ], spaceSeqList: [] },
[1]   mainFilters: {
[1]     sellingTypeList: [ 'SELL' ],
[1]     tradeRange: { min: 0, max: 999999 },
[1]     depositRange: { min: 0, max: 999999 },
[1]     priceRange: { min: 10, max: 200 },
[1]     isIncludeMaintenance: false,
[1]     pyeongRange: { min: 0, max: 30 },
[1]     useApprovalDateRange: { min: 0, max: 999999 },
[1]     dealTypeList: [ 'AGENT', 'DIRECT' ],
[1]     householdNumRange: { min: 0, max: 999999 },
[1]     parkingNumRange: { min: 0, max: 999999 },
[1]     isShortLease: false,
[1]     hasTakeTenant: false
[1]   }
[1] }
     */
    const qs: any = {
      filters: {
        sellingTypeList: ['MONTHLY_RENT', 'LEASE', 'SELL'],
        spaceSeqList: [],
      },
      mainFilters: {
        sellingTypeList: ['MONTHLY_RENT', 'LEASE', 'SELL'],
        tradeRange: { min: 0, max: 999999 },
        depositRange: { min: 0, max: 999999 },
        priceRange: { min: 0, max: 999999 },
        isIncludeMaintenance: false,
        pyeongRange: { min: 0, max: 999999 },
        useApprovalDateRange: { min: 0, max: 999999 },
        dealTypeList: ['AGENT', 'DIRECT'],
        householdNumRange: { min: 0, max: 999999 },
        parkingNumRange: { min: 0, max: 999999 },
        isShortLease: false,
        hasTakeTenant: false,

        //
      },
    };

    const tradeTypeText = tradeTypeVo[tradeType];
    qs.filters.sellingTypeList = [tradeTypeText];
    qs.mainFilters.sellingTypeList = [tradeTypeText];

    const SELL_MAX_PRICE = 1000000001;
    const MONTH_MAX_PRICE = 30000000;

    switch (tradeType) {
      case 'sell':
        // & ==================== 매매 / 전세 ====================

        if (details.cost[0] == 0) {
          qs.mainFilters.tradeRange.min = details.cost[0];
        } else {
          qs.mainFilters.tradeRange.min = details.cost[0] / 10000;
        }

        if (details.cost[1] == SELL_MAX_PRICE) {
          qs.mainFilters.tradeRange.max = 999999;
        } else {
          qs.mainFilters.tradeRange.max = details.cost[1] / 10000;
        }

        break;

      case 'lease':
        if (details.cost[0] == 0) {
          qs.mainFilters.depositRange.min = details.cost[0];
        } else {
          qs.mainFilters.depositRange.min = details.cost[0] / 10000;
        }

        if (details.cost[1] == SELL_MAX_PRICE) {
          qs.mainFilters.depositRange.max = details.cost[1];
        } else {
          qs.mainFilters.depositRange.max = details.cost[1] / 10000;
        }

        // & ==================== 매매 / 전세 ====================

        break;

      case 'monthlyRent':
        // & ==================== 월세 ====================

        if (details.rentCost[0] == 0) {
          qs.mainFilters.priceRange.min = details.rentCost[0];
        } else {
          qs.mainFilters.priceRange.min = details.rentCost[0] / 10000;
        }

        if (details.rentCost[1] == MONTH_MAX_PRICE) {
          qs.mainFilters.priceRange.max = 999999;
        } else {
          qs.mainFilters.priceRange.max = details.rentCost[1] / 10000;
        }

        qs.mainFilters.roomFloorList = ['GROUND_FIRST', 'GROUND_SECOND_OVER', 'SEMI_BASEMENT', 'ROOFTOP'];
        qs.mainFilters.roomTypeList = ['ONE_ROOM', 'TWO_ROOM'];
        qs.mainFilters.canParking = false;
        qs.mainFilters.hasElevator = false;
        qs.mainFilters.hasPano = false;
        qs.mainFilters.isDivision = false;
        qs.mainFilters.isDuplex = false;

        // & ==================== 월세 ====================

        break;
    }

    qs.mainFilters.pyeongRange.min = details.pyeong[0] == 10 ? 0 : details.pyeong[0];
    qs.mainFilters.pyeongRange.max = details.pyeong[1] == 61 ? 999999 : details.pyeong[1];

    return qs;
  }

  public convertToEstate(estate: any, estateType: string) {
    const cloneEstate: any = {};

    console.log(estate);

    cloneEstate.type = 'dabang';
    cloneEstate.articleName = estate.complexName;
    cloneEstate.complexNo = estate.complexNo;
    cloneEstate.articleNo = estate.articleNo;
    cloneEstate.tradeTypeName = estate.priceTypeName;
    cloneEstate.priceName = estate.priceTitle;

    const [floorInfo = null, area2 = null, area3 = null] = estate.roomDesc.split(',');

    cloneEstate.floorInfo = parseInt(floorInfo);
    cloneEstate.area2 = parseFloat(area2);
    cloneEstate.area3 = area3;
    cloneEstate.images = estate.imgUrlList.length > 0 ? JSON.stringify(estate.imgUrlList) : null;

    cloneEstate.title = estate.roomTitle;
    const estateTypeVo: any = {
      apt: 'apt',
      one: 'onetwo',
      villa: 'house',
      op: 'officetel',
    };

    cloneEstate.link = `https://www.dabangapp.com/map/${estateTypeVo[estateType]}?detail_id=${estate.articleNo}&detail_type=room`;
    cloneEstate.rDate = getNowDate();

    return cloneEstate;
  }

  /**
   * naver [dong] code를 dabang [dong] 코드로 변환
   * @param dong
   */
  private convertDong(dong: string) {
    const result = dong.split('').slice(0, -2).join('');
    return result;
  }

  public async getLocals() {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_local a WHERE 1`,
      type: 'all',
    });
  }

  public async getLocal(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_local a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }

  public async getRegions() {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_region a WHERE 1`,
      type: 'all',
    });
  }

  public async getRegion(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_region a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }

  public async getDongs(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_dong a WHERE a.code = '${code}'`,
      type: 'all',
    });
  }

  public async getDong(code: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.dabang_dong a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }
}
