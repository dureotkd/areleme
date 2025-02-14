import { Router, Request, Response } from 'express';
import Container from 'typedi';

import CollectServiceInstance from '../../services/collect/collect';

import AlarmInstance from '../../services/core/alarm';
import NaverInstance from '../../services/platform/naver';
import EstateInstance from '../../services/core/estate';
import ComplexInstance from '../../services/core/complex';
import RequestManagerInstance from '../../services/utils/requestManager';
import DabangInstance from '../../services/platform/dabang';

import { empty } from '../../utils/valid';
import { wait } from '../../utils/time';
import requestPromise from 'request-promise-native';

const route = Router();

export default (app: Router) => {
  app.use('/collect', route);

  // collect/local
  route.get('/local', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverLocal();
    await collectService.saveDabangLocal();

    return res.status(200).json({ message: 'Success' });
  });

  // collect/region
  route.get('/region', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverRegion();
    await collectService.saveDabangRegion();

    return res.status(200).json({ message: 'Success' });
  });

  // collect/dong
  route.get('/dong', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverDong();
    await collectService.saveDabangDong();

    return res.status(200).json({ message: 'Success' });
  });

  // collect/proxy
  route.get('/proxy', async (req: Request, res: Response) => {
    const RequestManagerService = Container.get(RequestManagerInstance);
    await RequestManagerService.makeProxy();

    return res.status(200).json({ message: 'Success' });
  });

  // collect/alarm
  route.get('/alarm', async (req: Request, res: Response) => {
    const NaverService = Container.get(NaverInstance);
    const DabangService = Container.get(DabangInstance);

    /**
     * 1. settings를 반복문 돌리면서 설정값을 확인한다.
     * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
     * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
     * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
     * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
     */
    await NaverService.runNewEstate();
    await DabangService.runNewEstate();

    return res.status(200).json({ message: 'Success' });
  });
};
