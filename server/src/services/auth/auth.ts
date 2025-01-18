import { Service } from 'typedi';

import { getNowDate } from '../../utils/time';
import { empty } from '../../utils/valid';

import mailService from '../utils/mail';
import solapiService from '../utils/solapi';

import ModelService from '../model/model';

@Service()
export default class AuthService {
  constructor(
    private readonly debug = false,

    private readonly modelService: ModelService,
    private readonly solapiService: solapiService,
    private readonly mailService: mailService,
  ) {}

  public async sendCode(to: string, type: string) {
    const res = {
      ok: true,
      error: {},
    };

    for await (const process of [1]) {
      const nowDate = getNowDate();

      const authCode = this.makeCode();
      const msg = `[매물알리미]\n인증번호 : ${authCode}`;

      console.log(msg);

      const insertSeq = await this.modelService.execute({
        debug: this.debug,
        database: 'areleme',
        sql: this.modelService.getInsertQuery({
          table: 'areleme.auth',
          data: {
            type: type,
            to: to,
            code: authCode,
            rDate: nowDate,
          },
        }),
        type: 'exec',
      });

      if (!insertSeq) {
        res.ok = false;
        break;
      }

      let sendRes = null;

      if (type === 'sms') {
        sendRes = await this.solapiService.sendSMS(to, '[인증번호]', msg);
      } else if (type === 'email') {
        sendRes = await this.mailService.send(to, '[인증번호]', msg);
      }

      if (!sendRes) {
        res.ok = false;
        break;
      }
    }

    return res;
  }

  public async vertifyCode({ type, to, code }: { type: string; to: string; code: string }) {
    let ok = true;

    for await (const process of [1]) {
      const targetWhere = [`\`type\` = '${type}'`, `\`to\` = '${to}'`, `ok = 0`];

      const authRow = await this.modelService.execute({
        database: 'areleme',
        sql: `SELECT * FROM areleme.auth WHERE %s ORDER BY rDate DESC LIMIT 1`.replace(
          '%s',
          targetWhere.join(' AND '),
        ),
        type: 'row',
      });

      if (empty(authRow)) {
        ok = false;
        break;
      }

      const authCode = authRow.code;

      if (authCode !== code) {
        ok = false;
        break;
      }

      targetWhere.push(`\`code\` = '${code}'`);

      await this.modelService.execute({
        debug: this.debug,
        database: 'areleme',
        sql: this.modelService.getUpdateQuery({
          table: 'areleme.auth',
          data: {
            ok: 1,
          },
          where: targetWhere,
        }),
        type: 'exec',
      });
    }

    return ok;
  }

  private makeCode() {
    const code = Math.floor(100000 + Math.random() * 900000);
    return code.toString();
  }
}
