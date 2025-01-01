import { Service } from 'typedi';

import ModelService from '../model/model';

import NaverService from '../platform/naver';
import DabangService from '../platform/dabang';
import ComplexService from './complex';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';

@Service()
export default class EstateService {
  constructor(
    private readonly debug: false,
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly modelService: ModelService,
    private readonly complexService: ComplexService,
  ) {}

  public async findNewEstates(complexDetails: any, lastEstate: any) {
    const newEstates = [];

    // * 매물이 없어 ? = 패스
    if (empty(complexDetails)) {
      return [];
    }

    const lastEstateIndex = complexDetails.findIndex((item: any) => lastEstate.articleNo === item.articleNo);

    /**
     * * 아예 못찾는거라 문제가 있음... (온보딩 설정후 바로 마지막매물을 넣었는데 왜 못찾지?) => 아마 페이지 2로 매물이 넘어가서?
     */
    if (lastEstateIndex === -1) {
      return [];
    }

    // * 새로운 매물이 나오지않았다 (온보딩 설정후 마지막 매물이 아직도 0번쨰이다)
    if (lastEstateIndex === 0) {
      return [];
    }

    console.log(`lastEstateIndex : ${lastEstateIndex}`);

    for (let i = 0; i < lastEstateIndex; i++) {
      const newComplexDetail = complexDetails[i];
      newComplexDetail.beforeArticleNo = lastEstate.articleNo;
      newEstates.unshift(newComplexDetail);
    }

    return newEstates;
  }

  public async makeEstate(newEstate: any[]): Promise<number> {
    try {
      const insertQuery = this.modelService.getInsertQuery({
        table: 'areleme.estate',
        data: newEstate,
      });

      return await this.modelService.execute({
        debug: this.debug,
        sql: insertQuery,
        type: 'exec',
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  /**
   * 마지막 매물을 UPDATE 해줍니다
   */
  public async updateLastEstate(params: any) {
    // console.log(settingSeq, articleNo);

    try {
      const updateQuery = this.modelService.getUpdateQuery({
        table: 'areleme.last_estate',
        data: {
          articleNo: params.articleNo,
        },
        where: [
          `settingSeq = '${params.settingSeq}'`,
          `articleNo = '${params.beforeAritlceNo}'`,
          `\`type\` = '${params.type}'`,
        ],
      });

      return await this.modelService.execute({
        debug: this.debug,
        sql: updateQuery,
        type: 'exec',
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  /**
   * 기준점을 만들어줍니다
   * 현재 기준으로 마지막 매물을 INSERT 해줍니다
   */
  public async makeLastEstateNaver(settingSeq: string, params: any) {
    console.log(params);
    const nowDate = getNowDate();

    const naverQs = this.naverService.convertToQuery(params);

    let estates = [];

    switch (params.estateType) {
      case 'apt':
        const complexes = await this.naverService.fetchComplexes(naverQs);

        if (!empty(complexes)) {
          for await (const { complexNo, complexName } of complexes) {
            console.log(complexNo, complexName);

            await this.complexService.makeComplex({
              settingSeq: settingSeq,
              no: complexNo,
              name: complexName,
              type: 'naver',
              rDate: nowDate,
            });

            const complexDetails = await this.naverService.fetchComplexDetails(complexNo, naverQs);

            if (!empty(complexDetails)) {
              complexDetails[0].complexNo = complexNo;
              estates.push(complexDetails[0]);
            }
          }
        }

        break;

      case 'one':
        estates = await this.naverService.fetchOneTowRooms(naverQs);

        break;

      case 'villa':
        estates = await this.naverService.fetchVillaJutaeks(naverQs);

        break;

      case 'op':
        const officetels = await this.naverService.fetchOfficetels(naverQs);

        if (!empty(officetels)) {
          for await (const { complexNo } of officetels) {
            await this.modelService.execute({
              debug: this.debug,
              sql: this.modelService.getInsertQuery({
                table: 'areleme.complex',
                data: {
                  settingSeq: settingSeq,
                  no: complexNo,
                  rDate: nowDate,
                  type: 'naver',
                },
              }),
              type: 'exec',
            });

            const complexDetails = await this.naverService.fetchComplexDetails(complexNo, naverQs);
            complexDetails[0].complexNo = complexNo;
            estates.push(complexDetails[0]);
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
}
