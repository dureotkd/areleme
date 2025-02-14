import { Router, Request, Response } from 'express';
import Container from 'typedi';

import NaverServiceInstance from '../../services/platform/naver';
import DabangServiceInstance from '../../services/platform/dabang';

const route = Router();

export default (app: Router) => {
  app.use('/address', route);

  route.get('/local', async (req: Request, res: Response) => {
    const naverService = Container.get(NaverServiceInstance);

    const result = {
      code: 'success',
      data: [],
      msg: '',
    };

    let locals = [];

    try {
      locals = await naverService.getLocals();
      result.data = locals;
    } catch (error) {
      console.error('Error fetching locals:', error);
      result.code = 'fail';
      result.msg = '알수없는 오류가 발생하였습니다';
    }

    res.send(result);
  });

  route.get('/local/:code', async (req: Request, res: Response) => {
    const { code } = req.params;

    const naverService = Container.get(NaverServiceInstance);

    const result = {
      code: 'success',
      data: [],
      msg: '',
    };

    let local = [];

    try {
      local = await naverService.getLocal(code);

      if (local.length === 0) {
        result['code'] = 'fail';
        result['msg'] = `${code}값 오류 `;
      }

      result['data'] = local;
    } catch (error) {
      result['code'] = 'fail';
      result['msg'] = '알수없는 오류가 발생하였습니다';
    }

    res.send(result);
  });

  route.get('/region/:localCode', async (req: Request, res: Response) => {
    const { localCode } = req.params;

    const naverService = Container.get(NaverServiceInstance);

    const result = {
      code: 'success',
      data: [],
      msg: '',
    };

    let region = [];

    try {
      region = await naverService.getRegionsOfLocal(localCode);
      result['data'] = region;

      if (region.length === 0) {
        result['code'] = 'fail';
        result['msg'] = `${localCode}값 오류 `;
      }
    } catch (error) {
      result['code'] = 'fail';
      result['msg'] = '알수없는 오류가 발생하였습니다';
    }

    res.send(result);
  });

  route.get('/dong/:regionCode', async (req: Request, res: Response) => {
    const { regionCode } = req.params;

    const naverService = Container.get(NaverServiceInstance);

    const result = {
      code: 'success',
      data: [],
      msg: '',
    };

    let dongs = [];

    try {
      dongs = await naverService.getDongsOfRegion(regionCode);
      result['data'] = dongs;

      if (dongs.length === 0) {
        result['code'] = 'fail';
        result['msg'] = `${regionCode}값 오류 `;
      }
    } catch (error) {
      result['code'] = 'fail';
      result['msg'] = '알수없는 오류가 발생하였습니다';
    }

    res.send(result);
  });

  route.get('/dong/:code', async (req: Request, res: Response) => {});
};
