import Container from 'typedi';
import cron from 'node-cron';
import dayjs from 'dayjs';

import { empty } from '../utils/valid';
import { waitRandom } from '../utils/time';

import AlarmInstance from '../services/core/alarm';
import EstateInstance from '../services/core/estate';
import SettingInstance from '../services/core/setting';

import NaverInstance from '../services/platform/naver';
import DabangInstance from '../services/platform/dabang';

export default async () => {
  cron.schedule('*/5 * * * *', async () => {
    // 현재 시간 가져오기
    const currentTime = dayjs();

    const startHour = 7;
    const endHour = 22;

    if (!(currentTime.hour() >= startHour && currentTime.hour() < endHour)) {
      console.log('작동 시간 외입니다. 작업을 수행하지 않습니다.');
      return;
    }

    const NaverService = Container.get(NaverInstance);
    const DabangService = Container.get(DabangInstance);

    await NaverService.runNewEstate();
  });
};
