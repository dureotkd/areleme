import Container from 'typedi';
import cron from 'node-cron';

import { empty } from '../utils/valid';

import AlarmInstance from '../services/core/alarm';
import NaverInstance from '../services/platform/naver';
import EstateInstance from '../services/core/estate';
import RequestManagerInstance from '../services/utils/requestManager';

export default async () => {
  cron.schedule('*/5 * * * *', async () => {
    const AlarmService = Container.get(AlarmInstance);
    const NaverService = Container.get(NaverInstance);
    const EstateService = Container.get(EstateInstance);
    const RequestManagerService = Container.get(RequestManagerInstance);

    const settings = await AlarmService.getSettings();

    console.log(`======= 알림 START 총 : ${settings.length} =======\n`);
    /**
     * 1. settings를 반복문 돌리면서 설정값을 확인한다.
     * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
     * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
     * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
     * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
     */
    for await (const setting of settings) {
      await RequestManagerService.waitRandom();

      const paramJson = JSON.parse(setting.params);
      const naverQs = NaverService.convertToQuery(paramJson);

      console.log(`setting : ${setting.seq} START \n`, naverQs);

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

              console.log(`complexName:${complex.name} :: ${complexDetails.length} \n`);

              const findNewEstates: any = await EstateService.findNewEstates(complexDetails, lastEstate);

              if (empty(findNewEstates)) {
                console.log(`매물이 존재하지 않습니다 :: ${complex.name} (${complex.no}) \n`);
                continue;
              }

              for await (const newEstate of findNewEstates) {
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
              }

              const findLastEstate = findNewEstates[findNewEstates.length - 1];

              // * UPDATE ...
              await EstateService.updateLastEstate({
                settingSeq: setting.seq,
                articleNo: findLastEstate.articleNo,
                complexNo: findLastEstate.complexNo,
                type: 'naver',
              });
            }
          }

          break;

        case 'one':
        case 'villa':
          const estates =
            paramJson.estateType === 'one'
              ? await NaverService.fetchOneTowRooms(naverQs)
              : await NaverService.fetchVillaJutaeks(naverQs);

          const lastEstate = await NaverService.getLastEstateQuery({
            where: [`settingSeq = '${setting.seq}'`],
            type: 'row',
          });
          const findNewEstates: any = await EstateService.findNewEstates(estates, lastEstate);

          if (empty(findNewEstates)) {
            console.log(`매물이 존재하지 않습니다 :: 원/투룸 \n`);
            continue;
          }

          for await (const newEstate of findNewEstates) {
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
          }

          const findLastEstate = findNewEstates[findNewEstates.length - 1];

          // * UPDATE ...
          await EstateService.updateLastEstate({
            settingSeq: setting.seq,
            articleNo: findLastEstate.articleNo,
            complexNo: findLastEstate.complexNo,
            type: 'naver',
          });

          break;
      }
    }

    console.log(`======= 알림 END 총 : ${settings.length} =======`);
  });
};
