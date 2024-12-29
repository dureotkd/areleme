import Container from 'typedi';
import cron from 'node-cron';

import AlarmInstance from '../services/core/alarm';
import NaverInstance from '../services/core/naver';

type Setting = {
  seq: number;
  userSeq: number;
  params: {};
  sendTypes: string;
  rDate: Date;
};

export default async () => {
  cron.schedule('* * * * * *', async () => {
    //     const AlarmService = Container.get(AlarmInstance);
    //     const NaverService = Container.get(NaverInstance);
    //     const settings = await AlarmService.getSettings();
    //     /**
    //      * 1. settings를 반복문 돌리면서 설정값을 확인한다.
    //      * 2. 설정값을 [네이버,다방] 파라미터로 구분화 한다
    //      * 3. 네이버 부동산 매물을 파라미터로 검색해 수집한다
    //      * 4. 다방 부동산 매물을 파라미터로 검색해 수집한다
    //      * 5. 새로운 매물이 나온걸 확인하면 회원에게 알림을 보낸다.
    //      */
    //     /**
    //  *    seq: 1,
    // [1]     userSeq: 1,
    // [1]     params: '{"estateType":"apt","tradeType":"sell","local":"1100000000","region":"1174000000","dong":"1174010200","details":{"cost":[0,1000000001],"rentCost":[100000,2000000],"pyeong":[10,61]},"selectCodes":["talk"],"inputs":{"sms":"01056539944"}}',
    // [1]     sendTypes: 'talk',
    // [1]     rDate: 2024-12-29T03:53:50.000Z,
    // [1]     eDate: 2024-12-29T03:53:50.000Z
    // [1]   }
    // [1] ]
    //  */
    //     for await (const row of settings) {
    //       const { seq, userSeq, params, sendTypes } = row;
    //       const paramList = JSON.parse(params);
    //       const naverQs = NaverService.converyToQuery(paramList);
    //       await NaverService.fetchComplexes(naverQs);
    //       break;
    //     }
  });
};
