import { empty } from './../../utils/valid';
import { Router, Request, Response } from 'express';
import Container from 'typedi';

import AlarmInstance from '../../services/core/alarm';
import EstateInstance from '../../services/core/estate';
import ComplexInstance from '../../services/core/complex';

const route = Router();

/**
     *    params: {
[1]     estateType: 'apt',
[1]     tradeType: 'sell',
[1]     local: '3000000000',
[1]     region: '3020000000',
[1]     dong: '3020012200',
[1]     details: { cost: [Array], rentCost: [Array], pyeong: [Array] },
[1]     selectCodes: [ 'talk' ],
[1]     inputs: { sms: '01056539944', email: '' }
[1]   }
     */
type Params = {
  estateType: string;
  tradeType: string;
  local: string;
  region: string;
  dong: string;
  details: {
    cost: number[];
    rentCost: number[];
    pyeong: number[];
  };
  selectCodes: string[];
};

export default (app: Router) => {
  app.use('/alarm', route);

  // http://localhost:5000/api/alarm,
  route.post('/setting', async (req: Request, res: Response) => {
    const AlarmService = Container.get(AlarmInstance);
    const EstateService = Container.get(EstateInstance);

    const userSeq = (req?.body?.userSeq || []) as number;
    const { estateType, tradeType, local, region, dong, details, selectCodes } = (req?.body?.params ||
      {}) as Params;

    const apiRes = {
      ok: true,
      msg: '',
      seq: 0,
    };

    for await (const process of [1]) {
      if (empty(userSeq)) {
        apiRes.ok = false;
        apiRes.msg = '회원번호가 없습니다';
        break;
      }

      if (empty(estateType)) {
        apiRes.ok = false;
        apiRes.msg = '매물타입이 없습니다';
        break;
      }
      if (empty(tradeType)) {
        apiRes.ok = false;
        apiRes.msg = '거래유형이 없습니다';
        break;
      }
      if (empty(local)) {
        apiRes.ok = false;
        apiRes.msg = '지역정보가 없습니다';
        break;
      }
      if (empty(region)) {
        apiRes.ok = false;
        apiRes.msg = '지역정보가 없습니다';
        break;
      }
      if (empty(dong)) {
        apiRes.ok = false;
        apiRes.msg = '지역정보가 없습니다';
        break;
      }
      if (empty(details)) {
        apiRes.ok = false;
        apiRes.msg = '상세검색이 없습니다';
        break;
      }
      if (empty(selectCodes)) {
        apiRes.ok = false;
        apiRes.msg = '알림유형이 없습니다';
        break;
      }

      const params = req.body.params;

      try {
        const sameSettingRow = await AlarmService.getSettingCustomQuery({
          where: [`userSeq = '${userSeq}'`, `params = '${JSON.stringify(params)}'`],
          type: 'row',
        });

        if (!empty(sameSettingRow)) {
          apiRes.ok = false;
          apiRes.msg = '동일한 조건으로 설정된 알림이 존재합니다';
          break;
        }

        const settingSeq = await AlarmService.makeSetting({
          userSeq: userSeq,
          params: params,
          sendTypes: selectCodes,
        });

        if (!settingSeq) {
          apiRes.ok = false;
          apiRes.msg = '알수없는 오류가 발생하였습니다';
          break;
        }

        await EstateService.makeLastEstateNaver(settingSeq, params);

        apiRes.seq = settingSeq;
      } catch (error) {
        console.log(error);
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });

  route.get('/complex/:settingSeq', async (req: Request, res: Response) => {
    const ComplexService = Container.get(ComplexInstance);
    const { settingSeq } = req?.params;

    const apiRes = {
      ok: true,
      msg: '',
      data: [],
    };

    for await (const process of [1]) {
      if (empty(settingSeq)) {
        apiRes.ok = false;
        apiRes.msg = '필수 정보 부족';
        break;
      }

      apiRes.data = await ComplexService.getComplexes(settingSeq);
    }

    return res.status(200).json(apiRes);
  });
};
