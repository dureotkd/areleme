import { Router, Request, Response } from 'express';
import Container from 'typedi';

import CollectServiceInstance from '../../services/collect/collect';

import AlarmInstance from '../../services/core/alarm';
import NaverInstance from '../../services/core/naver';
import LogInstance from '../../services/core/log';

import { empty } from '../../utils/valid';

const route = Router();

export default (app: Router) => {
  app.use('/collect', route);

  // http://localhost:5000/api/collect/local
  route.get('/local', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverLocal();
    await collectService.saveDabangLocal();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:5000/api/collect/region
  route.get('/region', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverRegion();
    await collectService.saveDabangRegion();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:5000/api/collect/dong
  route.get('/dong', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverDong();
    await collectService.saveDabangDong();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:5000/api/collect/test
  route.get('/test', async (req: Request, res: Response) => {
    const AlarmService = Container.get(AlarmInstance);
    const NaverService = Container.get(NaverInstance);
    const LogService = Container.get(LogInstance);

    const settings = await AlarmService.getSettings();

    const logRes = {
      ok: 1,
      msg: '',
      settingSeq: 0,
      alarmSeq: 0,
      complexNo: 0,
    };

    /**
     * 1. settings를 반복문 돌리면서 설정값을 확인한다.
     * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
     * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
     * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
     * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
     */
    const complexDetails = [];

    for await (const settingRow of settings) {
      const { seq, userSeq, params, sendTypes } = settingRow;

      logRes.settingSeq = seq;

      const paramArray = JSON.parse(params);
      const naverQs = NaverService.converyToQuery(paramArray);
      const complexes = await NaverService.fetchComplexes(naverQs);

      if (empty(complexes)) {
        logRes.ok = 0;
        logRes.msg = 'complexes가 존재하지 않습니다';
        // await LogService.makeAlarmLog(logRes);
        break;
      }

      for await (const complexRow of complexes) {
        const { complexNo } = complexRow;
        logRes.complexNo = complexNo;

        // 최근게시글
        naverQs.order = 'dateDesc';
        const complexDetail = await NaverService.fetchComplexDetail(complexNo, naverQs);

        console.log(complexDetail);

        if (empty(complexDetail)) {
          logRes.ok = 0;
          logRes.msg = 'complexDetail가 존재하지 않습니다';
          // await LogService.makeAlarmLog(logRes);
          continue;
        }

        break;
      }
    }

    return res.status(200).json({ message: 'Success' });
  });
};
