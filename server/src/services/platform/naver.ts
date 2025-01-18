import { Service } from 'typedi';
import request from 'request-promise-native';

import config from '../../config';

import { wait, getNowDate } from '../../utils/time';
import { empty } from '../../utils/valid';
import { convertToSquareMeters } from '../../utils/string';
import requestManagerService from '../utils/requestManager';

import ModelService from '../model/model';
import SettingService from '../core/setting';
import EstateService from '../core/estate';
import ComplexService from '../core/complex';
import AlarmService from '../core/alarm';

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
  tag?: string;
};

@Service()
export default class NaverService {
  constructor(
    private readonly debug: false,
    private readonly modelService: ModelService,
    private readonly complexService: ComplexService,
    private readonly settingService: SettingService,
    private readonly estateService: EstateService,
    private readonly alarmService: AlarmService,
    private readonly requestManagerService: requestManagerService,
  ) {}

  public async fetchLocal() {
    try {
      const data = await request({
        uri: 'https://new.land.naver.com/api/regions/list?cortarNo=0000000000',
        method: 'GET',
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersNaver(),
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
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersNaver(),
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
        proxy: await this.requestManagerService.getRandomProxy(),
        headers: this.requestManagerService.getHeadersNaver(),
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

  public async fetchOneTowRooms(qs: ComplexesQs) {
    qs.realEstateType = 'APT:OPST:ABYG:OBYG:GM:OR:VL:DDDGG:JWJT:SGJT:HOJT';
    qs.tag = ' :::::::SMALLSPCRENT';

    return await request({
      uri: `https://new.land.naver.com/api/articles`,
      method: 'GET',
      qs: qs,
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersNaver(),
    }).then((res) => {
      const data = JSON.parse(res);

      return data.articleList;
    });
  }

  public async fetchVillaJutaeks(qs: ComplexesQs) {
    qs.realEstateType = 'VL:DDDGG:JWJT:SGJT:HOJT';
    qs.tag = '::::::::';

    return await request({
      uri: `https://new.land.naver.com/api/articles`,
      method: 'GET',
      qs: qs,
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersNaver(),
    }).then((res) => {
      const data = JSON.parse(res);

      return data.articleList;
    });
  }

  /**
   * 아파트 단지 정보를 불러오는 API
   */
  public async fetchComplexes(qs: ComplexesQs) {
    qs.realEstateType = 'PRE:APT:ABYG:JGC';

    return await request({
      uri: `https://new.land.naver.com/api/regions/complexes`,
      method: 'GET',
      qs: qs,
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersNaver(),
    }).then((res) => {
      const data = JSON.parse(res);

      return data.complexList;
    });
  }

  public async fetchOfficetels(qs: ComplexesQs) {
    qs.realEstateType = 'PRE:OPST';

    return await request({
      uri: `https://new.land.naver.com/api/regions/complexes`,
      method: 'GET',
      qs: qs,
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersNaver(),
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
      rejectUnauthorized: false, // SSL 인증서 검증을 비활성화
      proxy: await this.requestManagerService.getRandomProxy(),
      headers: this.requestManagerService.getHeadersNaver(),
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

  public async getComplexCustomQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.complex a WHERE %s`.replace('%s', where.join(' AND ')),
      type: type,
    });
  }

  public async getLastEstateQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.last_estate a WHERE a.type = 'naver' AND %s`.replace(
        '%s',
        where.join(' AND '),
      ),
      type: type,
    });
  }

  public async runNewEstate() {
    const settings = await this.settingService.getSettings();

    for await (const setting of settings) {
      const paramJson = JSON.parse(setting.params);
      const naverQs = this.convertToQuery(paramJson);

      switch (paramJson.estateType) {
        case 'apt':
        case 'op':
          const complexes = await this.getComplexCustomQuery({
            where: [`settingSeq = '${setting.seq}'`],
            type: 'all',
          });

          if (!empty(complexes)) {
            for await (const complex of complexes) {
              const lastEstate = await this.getLastEstateQuery({
                where: [`settingSeq = '${setting.seq}'`, `complexNo = '${complex.no}'`],
                type: 'row',
              });

              const complexDetails = await this.fetchComplexDetails(complex.no, naverQs);

              console.log(`complexName:${complex.name} ${complex.no} :: ${complexDetails.length} \n`);

              // if (complex.name === '향촌') {
              //   // console.log(naverQs);
              // }

              const findNewEstates: any = await this.estateService.findNewEstates(complexDetails, lastEstate);

              if (empty(findNewEstates)) {
                console.log(`매물이 존재하지 않습니다 :: ${complex.name} (${complex.no}) \n`);
                continue;
              }

              for await (const newEstate of findNewEstates) {
                newEstate.type = 'naver';
                newEstate.settingSeq = setting.seq;

                const myEstateEntitiy = await this.convertToEstate(newEstate);
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

              /**
               * ? 테스트를 어떻게 할것인가..
               *
               * * 처음 Setting후 LastEstate가 Insert안됐지만
               * * 알림 전송 과정에서 발견하였을 경우!
               */
              if (!empty(lastEstate)) {
                // * UPDATE ...
                await this.estateService.updateLastEstate({
                  settingSeq: setting.seq,
                  articleNo: findLastEstate.articleNo,
                  complexNo: findLastEstate.complexNo,
                  type: 'naver',
                });
              } else {
                // & INSERT ...
                await this.initLastEstate(setting.seq, naverQs);
              }
            }
          }

          break;

        case 'one':
        case 'villa':
          const estates =
            paramJson.estateType === 'one'
              ? await this.fetchOneTowRooms(naverQs)
              : await this.fetchVillaJutaeks(naverQs);

          const lastEstate = await this.getLastEstateQuery({
            where: [`settingSeq = '${setting.seq}'`],
            type: 'row',
          });
          const findNewEstates: any = await this.estateService.findNewEstates(estates, lastEstate);

          if (empty(findNewEstates)) {
            console.log(`매물이 존재하지 않습니다 :: 원/투룸 \n`);
            continue;
          }

          for await (const newEstate of findNewEstates) {
            newEstate.type = 'naver';
            newEstate.settingSeq = setting.seq;

            const myEstateEntitiy = await this.convertToEstate(newEstate);
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
            type: 'naver',
          });

          break;
      }
    }
  }

  /**
   * 기준점을 만들어줍니다
   * 현재 기준으로 마지막 매물을 INSERT 해줍니다
   */
  public async initLastEstate(settingSeq: string, params: any) {
    const nowDate = getNowDate();
    const naverQs = this.convertToQuery(params);

    let estates = [];

    switch (params.estateType) {
      case 'apt':
        const complexes = await this.fetchComplexes(naverQs);

        if (!empty(complexes)) {
          for await (const { complexNo, complexName } of complexes) {
            console.log(complexNo, complexName);

            await this.complexService.makeComplex({
              settingSeq: settingSeq,
              no: complexNo,
              name: complexName,
              rDate: nowDate,
            });

            const complexDetails = await this.fetchComplexDetails(complexNo, naverQs);

            if (!empty(complexDetails)) {
              complexDetails[0].complexNo = complexNo;
              estates.push(complexDetails[0]);
            }
          }
        }

        break;

      case 'one':
        estates = await this.fetchOneTowRooms(naverQs);

        if (estates.length > 1) {
          estates.splice(1);
        }

        break;

      case 'villa':
        estates = await this.fetchVillaJutaeks(naverQs);

        if (estates.length > 1) {
          estates.splice(1);
        }

        break;

      case 'op':
        const officetels = await this.fetchOfficetels(naverQs);

        if (!empty(officetels)) {
          for await (const { complexNo, complexName } of officetels) {
            await this.modelService.execute({
              debug: this.debug,
              sql: this.modelService.getInsertQuery({
                table: 'areleme.complex',
                data: {
                  settingSeq: settingSeq,
                  no: complexNo,
                  name: complexName,
                  rDate: nowDate,
                },
              }),
              type: 'exec',
            });

            const complexDetails = await this.fetchComplexDetails(complexNo, naverQs);

            if (!empty(complexDetails)) {
              complexDetails[0].complexNo = complexNo;
              estates.push(complexDetails[0]);
            }
          }
        }

        break;
    }

    if (!empty(estates)) {
      for await (const { articleNo, complexNo } of estates) {
        await this.modelService.execute({
          debug: this.debug,
          sql: this.modelService.getInsertQuery({
            table: 'areleme.last_estate',
            data: {
              settingSeq: settingSeq,
              articleNo: articleNo,
              complexNo: complexNo,
              type: 'naver',
              rDate: nowDate,
              eDate: nowDate,
            },
          }),
          type: 'exec',
        });
      }
    }

    return true;
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
  public convertToQuery({ estateType, tradeType, dong, details }: any) {
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
      tag: '',
      order: 'dateDesc',
    };

    qs.tradeType = tradeTypeVo[tradeType];

    const myPriceMaxStan = tradeType == 'monthlyRent' ? 30000000 : 1000000001;

    qs.priceMax = details.cost[1] == myPriceMaxStan ? 900000000 : details.cost[1];

    if (details.cost[0] == 0) {
      qs.priceMin = details.cost[0];
    } else {
      qs.priceMin = details.cost[0] / 10000;
    }

    if (details.cost[1] == myPriceMaxStan) {
      qs.priceMax = details.cost[1];
    } else {
      qs.priceMax = details.cost[1] / 10000;
    }

    if (details.rentCost[0] == 0) {
      qs.rentPriceMin = details.rentCost[0];
    } else {
      qs.rentPriceMin = details.rentCost[0] / 10000;
    }

    if (details.rentCost[1] == myPriceMaxStan) {
      qs.rentPriceMax = details.rentCost[1];
    } else {
      qs.rentPriceMax = details.rentCost[1] / 10000;
    }

    qs.areaMin = details.pyeong[0] == 10 ? 0 : convertToSquareMeters(details.pyeong[0]);
    qs.areaMax = details.pyeong[1] == 61 ? 900000000 : convertToSquareMeters(details.pyeong[1]);

    return qs;
  }

  /**
   * 
   * [1] {
[1]   articleNo: '2503201949',  
[1]   articleName: '목련',      
[1]   articleStatus: 'R0',      
[1]   realEstateTypeCode: 'APT',
[1]   realEstateTypeName: '아파트',
[1]   articleRealEstateTypeCode: 'A01',
[1]   articleRealEstateTypeName: '아파트',
[1]   tradeTypeCode: 'A1',
[1]   tradeTypeName: '매매',
[1]   verificationTypeCode: 'DOCV2',
[1]   floorInfo: '5/15',
[1]   priceChangeState: 'SAME',
[1]   isPriceModification: false,
[1]   dealOrWarrantPrc: '7억 7,000',
[1]   areaName: '92',
[1]   area1: 92,
[1]   area2: 75,
[1]   direction: '남향',
[1]   articleConfirmYmd: '20250117',
[1]   siteImageCount: 0,
[1]   articleFeatureDesc: '전세안고 매매.추가비용무.샷시포함올리모.거실.방확장.시야트인라인.',
[1]   tagList: [ '25년이상', '대단지', '방세개', '화장실한개' ],
[1]   buildingName: '303동',
[1]   sameAddrCnt: 3,
[1]   sameAddrDirectCnt: 0,
[1]   sameAddrMaxPrc: '7억 7,000',
[1]   sameAddrMinPrc: '7억 7,000',
[1]   cpid: 'bizmk',
[1]   cpName: '매경부동산',
[1]   cpPcArticleUrl: 'http://land.mk.co.kr/rd/rd.php?UID=2503201949',
[1]   cpPcArticleBridgeUrl: '',
[1]   cpPcArticleLinkUseAtArticleTitleYn: false,
[1]   cpPcArticleLinkUseAtCpNameYn: true,
[1]   cpMobileArticleUrl: '',
[1]   cpMobileArticleLinkUseAtArticleTitleYn: false,
[1]   cpMobileArticleLinkUseAtCpNameYn: false,
[1]   latitude: '36.350084',
[1]   longitude: '127.393086',
[1]   isLocationShow: false,
[1]   realtorName: '목련공인중개사사무소',
[1]   realtorId: 'voo0625',
[1]   tradeCheckedByOwner: false,
[1]   isDirectTrade: false,
[1]   isInterest: false,
[1]   isComplex: true,
[1]   detailAddress: '',
[1]   detailAddressYn: 'N',
[1]   isVrExposed: false,
[1]   complexNo: '5962',
[1]   type: 'naver',
[1]   settingSeq: 1
[1] }
   * @param estate 
   * @returns 
   */
  public convertToEstate(estate: any) {
    const cloneEstate: any = {};

    cloneEstate.type = estate.type;
    cloneEstate.settingSeq = estate.settingSeq;
    cloneEstate.complexNo = estate.complexNo;
    cloneEstate.articleNo = estate.articleNo;
    cloneEstate.articleName = estate.articleName;
    cloneEstate.tradeTypeName = estate.tradeTypeName;
    cloneEstate.priceName = estate.sameAddrMinPrc;
    cloneEstate.floorInfo = estate.floorInfo;
    cloneEstate.area2 = estate.area2;
    cloneEstate.direction = estate.direction;
    cloneEstate.title = estate.articleFeatureDesc;
    cloneEstate.rDate = getNowDate();
    cloneEstate.link = `https://new.land.naver.com/complexes/${estate.complexNo}?articleNo=${estate.articleNo}`;

    return cloneEstate;
  }
}
