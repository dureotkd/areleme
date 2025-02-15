import { Router, Request, Response } from 'express';
import Container from 'typedi';

import { empty } from '../../utils/valid';

import SettingInstance from '../../services/core/setting';

const route = Router();

type Params = {
  recommendType: string;
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
  app.use('/setting', route);

  // http://localhost:5000/setting
  route.post('/', async (req: Request, res: Response) => {
    const SettingService = Container.get(SettingInstance);

    const userSeq = (req?.body?.userSeq || []) as number;
    const params = req.body.params as Params;

    const apiRes = {
      code: 'success',
      msg: '전송되었습니다',
      seq: '',
    };

    for await (const process of [1]) {
      if (empty(userSeq)) {
        apiRes.code = 'fail';
        apiRes.msg = '회원번호가 없습니다';
        break;
      }

      if (empty(params.recommendType)) {
        apiRes.code = 'fail';
        apiRes.msg = '추천유형이 없습니다';
        break;
      }
      if (empty(params.estateType)) {
        apiRes.code = 'fail';
        apiRes.msg = '매물타입이 없습니다';
        break;
      }
      if (empty(params.tradeType)) {
        apiRes.code = 'fail';
        apiRes.msg = '거래유형이 없습니다';
        break;
      }
      if (empty(params.local)) {
        apiRes.code = 'fail';
        apiRes.msg = '지역정보(local)가 없습니다';
        break;
      }
      if (empty(params.region)) {
        apiRes.code = 'fail';
        apiRes.msg = '지역정보(region)가 없습니다';
        break;
      }
      if (empty(params.dong)) {
        apiRes.code = 'fail';
        apiRes.msg = '지역정보(dong)가 없습니다';
        break;
      }
      if (empty(params.details)) {
        apiRes.code = 'fail';
        apiRes.msg = '상세검색이 없습니다';
        break;
      }
      if (empty(params.selectCodes)) {
        apiRes.code = 'fail';
        apiRes.msg = '알림유형이 없습니다';
        break;
      }

      // const sameSettingRow = await SettingService.getCustomQuery({
      //   where: [`userSeq = '${userSeq}'`, `params = '${JSON.stringify(params)}'`],
      //   type: 'row',
      // });

      // if (!empty(sameSettingRow)) {
      //   apiRes.code = 'fail';
      //   apiRes.msg = '동일한 조건으로 설정된 알림이 존재합니다';
      //   break;
      // }

      const settingSeq = await SettingService.makeSetting({
        userSeq: userSeq,
        params: params,
        sendTypes: params.selectCodes,
      });

      if (!settingSeq) {
        apiRes.code = 'fail';
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }

      apiRes.seq = settingSeq;
    }

    return res.status(200).json(apiRes);
  });
};
