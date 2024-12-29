import { Service } from 'typedi';

import ModelService from '../model/model';

import { getNowDate } from './../../utils/time';
@Service()
export default class AlarmService {
  constructor(private readonly debug: true, private readonly modelService: ModelService) {}

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

  public async delete() {}
}
