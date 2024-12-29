import { getNowDate } from './../../utils/time';
import { Service } from 'typedi';

import ModelService from '../model/model';

@Service()
export default class UserService {
  constructor(private readonly debug = false, private readonly modelService: ModelService) {}

  public async makeUser(selectCodes: string[], inputs: { sms: string; email: string }) {
    const nickname = this.makeRandomNickname();
    const nowDate = getNowDate();

    return await this.modelService.execute({
      debug: this.debug,
      database: 'areleme',
      sql: this.modelService.getInsertQuery({
        table: 'areleme.user',
        data: {
          nickname: nickname,
          authType: selectCodes.join('/'),
          sms: inputs.sms,
          email: inputs.email,
          rDate: nowDate,
          eDate: nowDate,
        },
      }),
      type: 'exec',
    });
  }

  public async getUser(seq: string) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.user a WHERE a.seq = '${seq}'`,
      type: 'row',
    });
  }

  public async getUserCustomQuery({ where, type }: { where: string[]; type: 'all' | 'row' | 'one' }) {
    return await this.modelService.execute({
      sql: `SELECT * FROM areleme.user a WHERE %s`.replace('%s', where.join(' AND ')),
      type: type,
    });
  }

  private makeRandomNickname() {
    const adjectives = ['빠른', '느긋한', '귀여운', '화려한', '용감한'];
    const nouns = ['호랑이', '사자', '여우', '곰', '늑대'];

    const randomAdjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    const randomNoun = nouns[Math.floor(Math.random() * nouns.length)];
    const randomNumber = Math.floor(Math.random() * 9000) + 1000; // 1000 ~ 9999

    return `${randomAdjective} ${randomNoun} ${randomNumber}`;
  }
}
