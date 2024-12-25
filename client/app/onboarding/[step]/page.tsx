import { Suspense } from 'react';

import GovTypeList from '../components/GovTypeList';
import SellingTypeList from '../components/SellingTypeList';
import RegionList from '../components/RegionList';
import DongList from '../components/DongList';
import LocalList from '../components/LocalList';
import FetchLoading from '../../components/FetchLoading';
import DetailList from '../components/DetailList';

export default function Page({ params: { step } }: { params: { step: string } }) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renders: any = {
    '1': <GovTypeList page="1" />,
    '2': <SellingTypeList page="2" />,
    '3': <LocalList page="3" />,
    '4': <RegionList page="4" />,
    '5': <DongList page="5" />,
    '6': <DetailList page="6" />,
  };
  const Onboarding = renders[step] ?? <div>Not Found</div>;

  return (
    <Suspense fallback={<FetchLoading />}>
      <div className="flex flex-wrap w-full h-full t-left justify-start">{Onboarding}</div>
    </Suspense>
  );
}
