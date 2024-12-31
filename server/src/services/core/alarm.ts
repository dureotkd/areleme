import { Service } from 'typedi';

import ModelService from '../model/model';

import NaverService from './naver';
import DabangService from './dabang';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';
@Service()
export default class AlarmService {
  constructor(
    private readonly debug: true,
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly modelService: ModelService,
  ) {}

  public async send() {}

  public async getSettingCustomQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.alarm_setting a WHERE %s`.replace('%s', where.join(' AND ')),
      type: type,
    });
  }

  public async getSettings() {
    return await this.modelService.execute({
      sql: 'SELECT * FROM areleme.alarm_setting',
      type: 'all',
    });
  }

  public async makeSetting({ userSeq, params, sendTypes }: any) {
    const nowDate = getNowDate();

    return await this.modelService.execute({
      debug: this.debug,
      sql: this.modelService.getInsertQuery({
        table: 'areleme.alarm_setting',
        data: {
          userSeq: userSeq,
          params: JSON.stringify(params),
          sendTypes: sendTypes.join('/'),
          rDate: nowDate,
          eDate: nowDate,
        },
      }),
      type: 'exec',
    });
  }

  /**
   * 기준점을 만들어줍니다
   * 현재 기준으로 마지막 매물을 INSERT 해줍니다
   */
  public async makeNowLastEstate(settingSeq: string, params: any) {
    params.estateType = 'apt';
    console.log(params);
    const naverQs = this.naverService.converyToQuery(params);

    let estates = [];

    const nowDate = getNowDate();

    switch (params.estateType) {
      case 'apt':
        const complexes = await this.naverService.fetchComplexes(naverQs);

        if (!empty(complexes)) {
          for await (const { complexNo } of complexes) {
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
