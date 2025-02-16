import { Router, Request, Response } from 'express';
import Container from 'typedi';

import ComplexInstance from '../../services/core/complex';
import NaverInstance from '../../services/platform/naver';
import DabangInstance from '../../services/platform/dabang';

import { empty } from './../../utils/valid';
import { convertLImit } from './../../utils/string';

const route = Router();

export default (app: Router) => {
  app.use('/alarm', route);

  // http://localhost:5000/alarm,
  route.post('/', async (req: Request, res: Response) => {
    const NaverService = Container.get(NaverInstance);
    const DabangService = Container.get(DabangInstance);

    const settingSeq = (req?.body?.settingSeq || []) as string;

    const apiRes = {
      code: 'success',
      msg: '',
    };

    for await (const process of [1]) {
      if (!settingSeq) {
        apiRes.code = 'fail';
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }

      try {
        await NaverService.initLastEstate(settingSeq);
        await DabangService.initLastEstate(settingSeq);
      } catch (error) {
        console.log(error);
        apiRes.code = 'fail';
        apiRes.msg = '알수없는 오류가 발생하였습니다';
        break;
      }
    }

    return res.status(200).json(apiRes);
  });

  route.get('/complex/:settingSeq?', async (req: Request, res: Response) => {
    const ComplexService = Container.get(ComplexInstance);
    const { settingSeq } = req.params;
    const { page = 0 } = req.query as { page?: number };

    const apiRes = {
      code: 'success',
      msg: '',
      data: [],
    };

    for await (const process of [1]) {
      if (empty(settingSeq)) {
        apiRes.code = 'fail';
        apiRes.msg = '필수 정보 부족';
        break;
      }

      const limit = page > 0 ? convertLImit(page, 3) : '';

      apiRes.data = await ComplexService.getComplexCustomQuery({
        where: [`settingSeq = '${settingSeq}'`],
        type: 'all',
        limit: limit,
      });
    }

    return res.status(200).json(apiRes);
  });
};
