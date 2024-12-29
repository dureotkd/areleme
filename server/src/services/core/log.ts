import { Service } from 'typedi';

import ModelService from '../model/model';

import { getNowDate } from '../../utils/time';

@Service()
export default class LogService {
  constructor(private readonly debug: true, private readonly modelService: ModelService) {}

  public async makeAlarmLog(params: any) {
    const nowDate = getNowDate();

    return await this.modelService.execute({
      database: 'areleme',
      sql: this.modelService.getInsertQuery({
        table: 'areleme.alarm_log',
        data: {
          ...params,
          rDate: nowDate,
        },
      }),
      type: 'exec',
    });
  }
}
