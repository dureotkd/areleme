import { Suspense } from 'react';

import AlarmOrderTypes from '../components/AlarmOrderTypes';
import GovTypeList from '../components/GovTypeList';
import SellingTypeList from '../components/SellingTypeList';
import RegionList from '../components/RegionList';
import DongList from '../components/DongList';
import LocalList from '../components/LocalList';
import SendTypes from '../components/SendTypes';
import FetchLoading from '../../components/FetchLoading';
import DetailList from '../components/DetailList';
import CompletedAlarmSetting from '../components/CompletedAlarmSetting';

export default function Page({ params: { step } }: { params: { step: string } }) {
  const renders: any = {
    '1': <GovTypeList page="1" />,
    '2': <SellingTypeList page="2" />,
    '3': <LocalList page="3" />,
    '4': <RegionList page="4" />,
    '5': <DongList page="5" />,
    '6': <DetailList page="6" />,
    '7': <AlarmOrderTypes page="7" />,
    '8': <SendTypes page="8" />,
    complete: <CompletedAlarmSetting />,
  };

  const Onboarding = renders[step] ?? <div>Not Found</div>;

  return (
    <Suspense fallback={<FetchLoading />}>
      <div className="flex flex-wrap w-full h-full t-left justify-start">{Onboarding}</div>
    </Suspense>
  );
}
