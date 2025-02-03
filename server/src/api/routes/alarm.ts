import { empty } from './../../utils/valid';
import { Router, Request, Response } from 'express';
import Container from 'typedi';

import AlarmInstance from '../../services/core/alarm';
import ComplexInstance from '../../services/core/complex';
import SettingInstance from '../../services/core/setting';

import NaverInstance from '../../services/platform/naver';
import DabangInstance from '../../services/platform/dabang';

const route = Router();

export default (app: Router) => {
  app.use('/alarm', route);

  // http://localhost:5000/api/alarm,
  route.post('/', async (req: Request, res: Response) => {
    const NaverService = Container.get(NaverInstance);
    const DabangService = Container.get(DabangInstance);

    const settingSeq = (req?.body?.settingSeq || []) as string;

    const apiRes = {
      ok: true,
      msg: '',
    };

    for await (const process of [1]) {
      if (!settingSeq) {
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }

      try {
        await NaverService.initLastEstate(settingSeq);
        await DabangService.initLastEstate(settingSeq);
      } catch (error) {
        console.log(error);
        apiRes.ok = false;
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });

  route.get('/complex/:settingSeq?', async (req: Request, res: Response) => {
    const ComplexService = Container.get(ComplexInstance);
    const { settingSeq } = req.params;

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
