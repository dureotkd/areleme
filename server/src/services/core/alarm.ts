import { Service } from 'typedi';

import ModelService from '../model/model';

import { getNowDate } from './../../utils/time';
import NaverService from './naver';
import DabangService from './dabang';
@Service()
export default class AlarmService {
  constructor(
    private readonly debug: true,
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly modelService: ModelService,
  ) {}

  public async send() {}

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
   * 현재 기준으로 마지막 매물을 INSERT 해줍니다..
   */
  public async makeNowLastEstate(params: any) {
    const naverQs = this.naverService.converyToQuery(params);
    const lastEstate1 = this.naverService.fetchNowLastEstate(naverQs);

    return true;
  }
}
