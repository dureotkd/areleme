'use client';

import React from 'react';
import Layout from './Layout';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FetchLoading from '../../components/FetchLoading';

export default function CompletedAlarmSetting() {
  const router = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [sendTypes, setSendTypes] = React.useState<string[]>([]);

  React.useEffect(() => {
    (() => {
      let valid = true;

      for (let i = 1; i <= 6; i++) {
        const onboardingData = window.localStorage.getItem(`on_data_${i}`);

        if (!onboardingData) {
          valid = false;
          break;
        }
      }

      if (!valid) {
        router.replace('/');
      }

      window.localStorage.removeItem('on_page');

      for (let i = 1; i <= 6; i++) {
        window.localStorage.removeItem(`on_data_${i}`);
      }

      setLoading(false);
    })();
  }, []);

  if (loading) {
    return <FetchLoading />;
  }

  return (
    <Layout
      des="알림 설정 완료"
      isNext
      isOnlyNext
      nextName="확인했어요"
      nextOnClick={() => {
        router.replace('/');
      }}
    >
      <div>조건에 맞는 공고를 아래와 같이 보낼게요</div>
      <Image
        className="rounded-lg mt-lg"
        src="/static/images/ex_talk.png"
        alt="로고"
        width={300}
        height={200}
      />
    </Layout>
  );
}
