import { Router, Request, Response } from 'express';
import Container from 'typedi';

import AlarmInstance from '../../services/core/alarm';

import { empty } from '../../utils/valid';

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

    const userSeq = (req?.body?.userSeq || []) as number;
    const { estateType, tradeType, local, region, dong, details, selectCodes } = (req?.body?.params ||
      {}) as Params;

    const apiRes = {
      ok: true,
      msg: '',
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

      console.log(params);

      try {
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

        await AlarmService.makeNowLastEstate(params);
      } catch (error) {
        console.log(error);
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });
};
