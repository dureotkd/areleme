import { Service } from 'typedi';

import ModelService from '../model/model';

import solapiService from '../utils/solapi';
import mailService from '../utils/mail';

import { empty } from '../../utils/valid';
import { getNowDate } from '../../utils/time';
import { convertToPyeong } from '../../utils/string';
@Service()
export default class AlarmService {
  constructor(
    private readonly debug: false,
    private readonly solapiService: solapiService,
    private readonly mailService: mailService,
    private readonly modelService: ModelService,
  ) {}

  public async sendAlarm(estateSeq: number) {
    let res = {
      ok: true,
      estateSeq: estateSeq,
      msg: '',
    };

    for await (const process of [1]) {
      const estate = (await this.modelService.execute({
        sql: `SELECT * FROM areleme.estate a WHERE a.seq = '${estateSeq}'`,
        type: 'row',
      })) as any;

      if (empty(estate)) {
        res.ok = false;
        res.msg = 'estate empty';
        break;
      }

      // local":"3000000000","region":"3017000000","dong":"3017011200
      const setting = (await this.modelService.execute({
        sql: `SELECT * FROM areleme.alarm_setting a WHERE a.seq = '${estate.settingSeq}'`,
        type: 'row',
      })) as any;

      if (empty(setting)) {
        res.ok = false;
        res.msg = 'setting empty';
        break;
      }

      const { dong, selectCodes } = JSON.parse(setting.params);

      if (empty(selectCodes)) {
        res.ok = false;
        res.msg = 'selectCodes empty';
        break;
      }

      if (empty(dong)) {
        res.ok = false;
        res.msg = 'dong empty';
        break;
      }

      const user = (await this.modelService.execute({
        sql: `SELECT * FROM areleme.user a WHERE a.seq = '${setting.userSeq}'`,
        type: 'row',
      })) as any;

      if (empty(user)) {
        res.ok = false;
        res.msg = 'user empty';
        break;
      }

      const { localName, regionName, dongName } = await this.modelService.execute({
        sql: `SELECT 
          (SELECT  \`name\` FROM areleme.naver_local WHERE a.localCode = \`code\`) AS \`localName\`,
          (SELECT  \`name\` FROM areleme.naver_region WHERE a.regionCode = \`code\`) AS \`regionName\`,
          \`name\` AS \`dongName\`
        FROM 
          areleme.naver_dong a 
        WHERE 
          a.code = '${dong}'`,
        type: 'row',
      });

      console.log(estate);

      const [presentImage = null] = !empty(estate.images) ? JSON.parse(estate.images) : [];

      if (selectCodes.includes('sms')) {
        const sendRes = await this.solapiService.sendSMS(
          user.sms,
          `${localName} > ${regionName} > ${dongName}`,
          [
            `${estate.articleName}`,
            `${estate.tradeTypeName} ${estate.priceName}`,
            `${estate.floorInfo}층,${convertToPyeong(estate.area2)}평`,
            `${estate.title}`,
            `${estate.link}`,
          ].join('\n'),
        );

        if (empty(sendRes)) {
          res.ok = false;
          res.msg = 'sms sendRes empty';
          break;
        }
      }

      if (selectCodes.includes('email')) {
        const sendRes = await this.mailService.send(
          user.email,
          `${localName} > ${regionName} > ${dongName}`,
          [
            presentImage && `<img src="${presentImage}" alt="presentimage" />`,
            `<h2>${estate.articleName}</h2>`,
            `<h2 style="color:blue;">${estate.tradeTypeName} ${estate.priceName}</h2>`,
            `<h3>${estate.floorInfo}층,${convertToPyeong(estate.area2)}평</h3>`,
            `<h3>${estate.title}</h3>`,
            '<br/>',
            `${estate.link}`,
          ].join(''),
        );

        if (empty(sendRes)) {
          res.ok = false;
          res.msg = 'email sendRes empty';
          break;
        }
      }
    }

    return res.ok;
  }
}
