import { Service } from 'typedi';

import ModelService from '../model/model';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';

@Service()
export default class SettingService {
  constructor(private readonly debug: false, private readonly modelService: ModelService) {}

  public async getSettings() {
    try {
      return await this.modelService.execute({
        sql: 'SELECT * FROM areleme.alarm_setting a WHERE 1',
        type: 'all',
      });
    } catch (error: any) {
      console.log(error.message);
      return [];
    }
  }

  public async getCustomQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    try {
      return await this.modelService.execute({
        sql: `SELECT * FROM areleme.alarm_setting a WHERE %s`.replace('%s', where.join(' AND ')),
        type: type,
      });
    } catch (error: any) {
      console.log(error.message);
      return 0;
    }
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
