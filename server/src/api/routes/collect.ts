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

    console.log('hello');
    /**
     * 1. settings를 반복문 돌리면서 설정값을 확인한다.
     * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
     * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
     * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
     * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
     */
    const complexDetails = [];

    for await (const setting of settings) {
      const paramJson = JSON.parse(setting.params);
      const naverQs = NaverService.converyToQuery(paramJson);

      let estates = [];

      switch (paramJson.estateType) {
        case 'apt':
        case 'op':
          const complexes = await NaverService.getComplexCustomQuery({
            where: [`settingSeq = '${setting.seq}'`],
            type: 'all',
          });

          if (!empty(complexes)) {
            for await (const complex of complexes) {
              const lastEstate = await NaverService.getLastEstateQuery({
                where: [`complexNo = '${complex.no}'`],
                type: 'row',
              });

              const complexDetails = await NaverService.fetchComplexDetails(complex.no, naverQs);

              // * 매물이 없어 ? = 패스
              if (empty(complexDetails)) {
                continue;
              }

              const lastEstateIndex = complexDetails.findIndex(
                (item: any) => lastEstate.articleNo === item.articleNo,
              );

              // * 아예 못찾는거라 문제가 있음... (온보딩 설정후 바로 마지막매물을 넣었는데 왜 못찾지?)
              if (lastEstateIndex === -1) {
                continue;
              }

              // * 새로운 매물이 나오지않았다 (온보딩 설정후 마지막 매물이 아직도 0번쨰이다)
              if (lastEstateIndex === 0) {
                continue;
              }

              for (let i = 0; i < lastEstateIndex; i++) {
                const newComplexDetail = complexDetails[i];

                console.log(newComplexDetail);
              }

              // for await (const apiEstate of complexDetails) {

              //   if (lastEstate.articleNo === apiEstate.articleNo) {

              //     break;
              //   }

              // }
            }
          }

          break;

        case 'one':
          estates = await NaverService.fetchOneTowRooms(naverQs);

          break;

        case 'villa':
          estates = await NaverService.fetchVillaJutaeks(naverQs);

          break;
      }
    }

    return res.status(200).json({ message: 'Success' });
  });

  route.get('/dabang/test');
};
