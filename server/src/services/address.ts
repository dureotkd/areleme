import { Service } from 'typedi';

import ModelService from './core/model';

@Service()
export default class AddrService {
  constructor(private readonly modelService: ModelService) {}

  public async getLocals() {
    return await this.modelService.excute({
      sql: `SELECT * FROM areleme.local a WHERE 1`,
      type: 'all',
    });
  }

  public async getLocal(code: string) {
    return await this.modelService.excute({
      sql: `SELECT * FROM areleme.local a WHERE a.code = '${code}'`,
      type: 'row',
    });
  }

  public async getRegions() {
    return await this.modelService.excute({
      sql: `SELECT * FROM areleme.region a WHERE 1`,
      type: 'all',
    });
  }

  public async getRegion(code: string) {
    return await this.modelService.excute({
      sql: `SELECT * FROM areleme.region a WHERE a.code = '${code}'`,
      type: 'all',
    });
  }
}
