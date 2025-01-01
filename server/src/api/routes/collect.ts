import { Router, Request, Response } from 'express';
import Container from 'typedi';

import CollectServiceInstance from '../../services/collect/collect';

import AlarmInstance from '../../services/core/alarm';
import NaverInstance from '../../services/platform/naver';
import EstateInstance from '../../services/core/estate';

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
    const EstateService = Container.get(EstateInstance);

    const settings = await AlarmService.getSettings();

    console.log('======= 알림 START =======');
    /**
     * 1. settings를 반복문 돌리면서 설정값을 확인한다.
     * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
     * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
     * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
     * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
     */

    for await (const setting of settings) {
      const paramJson = JSON.parse(setting.params);
      const naverQs = NaverService.convertToQuery(paramJson);

      let newEstates = [];

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
                where: [`settingSeq = '${setting.seq}'`, `complexNo = '${complex.no}'`],
                type: 'row',
              });

              const complexDetails = await NaverService.fetchComplexDetails(complex.no, naverQs);

              newEstates = await EstateService.findNewEstates(complexDetails, lastEstate);
            }
          }

          break;

        case 'one':
          const onetwoRooms = await NaverService.fetchOneTowRooms(naverQs);

          break;

        case 'villa':
          const villaJutaeks = await NaverService.fetchVillaJutaeks(naverQs);

          break;
      }

      if (empty(newEstates)) {
        // * 새로운 매물이 존재하지않음
        console.log('새로운 매물이 존재하지 않습니다');
        continue;
      }

      for await (const newEstate of newEstates) {
        newEstate.type = 'naver';
        newEstate.settingSeq = setting.seq;

        const myEstateEntitiy = await NaverService.convertToEstate(newEstate);
        const estateSeq = await EstateService.makeEstate(myEstateEntitiy);

        if (empty(estateSeq)) {
          // ! DB ERROR
          console.log(`매물 등록시 에러가 발생하였습니다`);
          continue;
        }

        // * 알림 보내고
        const alarmRes = await AlarmService.sendAlarm();

        if (empty(alarmRes)) {
          // ! Alarm API ERROR
          console.log(`알림 전송시 에러가 발생하였습니다`);
          continue;
        }

        console.log('UPDATE...');

        // * UPDATE ...
        await EstateService.updateLastEstate({
          settingSeq: setting.seq,
          articleNo: newEstate.articleNo,
          beforeAritlceNo: newEstate.beforeArticleNo,
          type: 'naver',
        });
      }
    }

    return res.status(200).json({ message: 'Success' });
  });

  route.get('/dabang/test');
};
