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

  // http://localhost:4000/api/collect/local
  route.get('/local', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverLocal();
    await collectService.saveDabangLocal();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:4000/api/collect/region
  route.get('/region', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverRegion();
    await collectService.saveDabangRegion();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:4000/api/collect/dong
  route.get('/dong', async (req: Request, res: Response) => {
    const collectService = Container.get(CollectServiceInstance);
    await collectService.saveNaverDong();
    await collectService.saveDabangDong();

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:4000/api/collect/proxy
  route.get('/proxy', async (req: Request, res: Response) => {
    const RequestManagerService = Container.get(RequestManagerInstance);
    await RequestManagerService.makeProxy();

    return res.status(200).json({ message: 'Success' });
  });

  route.get('/dabang-one', async (req: Request, res: Response) => {
    const RequestManagerService = Container.get(RequestManagerInstance);

    const a = await requestPromise({
      uri: 'https://www.dabangapp.com/api/v5/room-list/category/one-two/region',
      method: 'GET',
      qs: {
        code: '30170112',
        page: 1,
        useMap: 'naver',
        zoom: 14,
        filters:
          '{"sellingTypeList":["MONTHLY_RENT"],"depositRange":{"min":0,"max":999999},"priceRange":{"min":0,"max":999999},"isIncludeMaintenance":false,"pyeongRange":{"min":0,"max":999999},"useApprovalDateRange":{"min":0,"max":999999},"roomFloorList":["GROUND_FIRST","GROUND_SECOND_OVER","SEMI_BASEMENT","ROOFTOP"],"roomTypeList":["ONE_ROOM","TWO_ROOM"],"dealTypeList":["AGENT","DIRECT"],"canParking":false,"isShortLease":false,"hasElevator":false,"hasPano":false,"isDivision":false,"isDuplex":false}',
      },
      proxy: await RequestManagerService.getRandomProxy(),
      headers: RequestManagerService.getHeadersDabang(),
    }).then((res) => {
      return JSON.parse(res);
    });

    console.log(a.result);

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:4000/api/collect/dabang
  route.get('/dabang', async (req: Request, res: Response) => {
    const dabangService = Container.get(DabangInstance);
    const naverService = Container.get(NaverInstance);
    const complexService = Container.get(ComplexInstance);
    const complexes = (await dabangService.fetchComplexes('대전시 서구 둔산동')) as any;

    const a =
      '{"estateType":"apt","tradeType":"sell","local":"3000000000","region":"3017000000","dong":"3017011200","details":{"cost":[450000000,1000000001],"rentCost":[100000,2000000],"pyeong":[10,30]},"selectCodes":["email"]}';

    for await (const {
      name,
      location: [lng, lat],
      complex_id,
    } of complexes) {
      const naverComplex = await complexService.getComplexCustomQuery({
        where: [`\`name\` = '${name}'`, `settingSeq = 1`],
        type: 'row',
      });

      if (empty(naverComplex)) {
        console.log(`Hello.. Naver complex empty : ${name}`);
        continue;
      }

      await complexService.updateComplex(
        {
          dno: complex_id,
          lat: lat,
          lng: lng,
        },
        [`seq = '${naverComplex.seq}'`],
      );
    }

    await dabangService.initLastEstate('1', JSON.parse(a));

    return res.status(200).json({ message: 'Success' });
  });

  // http://localhost:4000/api/collect/alarm
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
    console.log('hello Dabang');

    return res.status(200).json({ message: 'Success' });
  });
};
