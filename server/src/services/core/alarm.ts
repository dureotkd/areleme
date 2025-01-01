import { Service } from 'typedi';

import ModelService from '../model/model';

import NaverService from '../platform/naver';
import DabangService from '../platform/dabang';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';
@Service()
export default class AlarmService {
  constructor(
    private readonly debug: false,
    private readonly naverService: NaverService,
    private readonly dabangService: DabangService,
    private readonly modelService: ModelService,
  ) {}

  public async sendAlarm() {
    return true;
  }

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
}
