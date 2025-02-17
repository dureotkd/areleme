import { Service } from 'typedi';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';

import ModelService from '../model/model';

@Service()
export default class ComplexService {
  constructor(private readonly debug: false, private readonly modelService: ModelService) {}

  public async getComplexes(settingSeq: string) {
    try {
      return await this.modelService.execute({
        sql: `SELECT * FROM areleme.complex WHERE settingSeq = '${settingSeq}'`,
        type: 'all',
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async getComplexCustomQuery({
    where,
    type,
    limit = '',
  }: {
    where: string[];
    type: 'all' | 'row' | 'one';
    limit?: string;
  }) {
    try {
      return await this.modelService.execute({
        sql: `SELECT * FROM areleme.complex a WHERE %s ${limit}`.replace('%s', where.join(' AND ')),
        type: type,
      });
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  public async makeComplex(data: any) {
    try {
      return await this.modelService.execute({
        debug: this.debug,
        sql: this.modelService.getInsertQuery({
          table: 'areleme.complex',
          data: data,
        }),
        type: 'exec',
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  public async updateComplex(data: {}, where: string[]) {
    try {
      return await this.modelService.execute({
        debug: this.debug,
        sql: this.modelService.getUpdateQuery({
          table: 'areleme.complex',
          data: data,
          where: where,
        }),
        type: 'exec',
      });
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}
