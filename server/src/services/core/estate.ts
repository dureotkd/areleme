import { Service } from 'typedi';

import ModelService from '../model/model';

import { empty } from '../../utils/valid';

@Service()
export default class EstateService {
  constructor(private readonly debug: false, private readonly modelService: ModelService) {}

  public async findNewEstates(complexDetails: any, lastEstate: any) {
    const newEstates = [];

    // * 매물이 없어 ? = 패스
    if (empty(complexDetails)) {
      return [];
    }

    let lastEstateIndex = complexDetails.findIndex((item: any) => {
      return lastEstate.articleNo === item.articleNo;
    });

    /**
     * * 아예 못찾는거라 문제가 있음... (온보딩 설정후 바로 마지막매물을 넣었는데 왜 못찾지?) => 아마 페이지 2로 매물이 넘어가서?
     */
    if (lastEstateIndex === -1) {
      lastEstateIndex = complexDetails.length;
    }

    // * 새로운 매물이 나오지않았다 (온보딩 설정후 마지막 매물이 아직도 0번쨰이다)
    if (lastEstateIndex === 0) {
      return [];
    }

    console.log(`lastEstateIndex : ${lastEstateIndex}`);

    for (let i = lastEstateIndex - 1; i >= 0; i--) {
      const newComplexDetail = complexDetails[i];
      newComplexDetail.complexNo = lastEstate.complexNo;
      newEstates.push(newComplexDetail);
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

  public async getLastEstateCustomQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.last_estate a WHERE %s`.replace('%s', where.join(' AND ')),
      type: type,
    });
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
          `complexNo = '${params.complexNo}'`,
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
}
