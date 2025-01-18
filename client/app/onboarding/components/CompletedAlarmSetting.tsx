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
  const [complexes, setComplexes] = React.useState<[]>([]);

  React.useEffect(() => {
    (async () => {
      if (!isValidData()) {
        router.replace('/');
        return;
      }

      const estateType = window.localStorage.getItem('on_data_1');
      const tradeType = window.localStorage.getItem('on_data_2');
      const local = window.localStorage.getItem('on_data_3');
      const region = window.localStorage.getItem('on_data_4');
      const dong = window.localStorage.getItem('on_data_5');
      const details = window.localStorage.getItem('on_data_6');
      const selectCodes = window.localStorage.getItem('on_data_7');
      const userSeq = window.localStorage.getItem('on_data_user_seq');

      const params = {
        estateType: estateType,
        tradeType: tradeType,
        local: local,
        region: region,
        dong: dong,
        details: JSON.parse(details),
        selectCodes: JSON.parse(selectCodes),
      };

      const settingApiRes = await fetch(`http://localhost:4000/api/alarm/setting`, {
        method: 'POST',
        body: JSON.stringify({
          userSeq: userSeq,
          params: params,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
        .then((res) => res.json())
        .finally(() => {
          // clearData();
        });

      // if (!settingApiRes.ok) {
      //   alert(settingApiRes.msg);
      //   return;
      // }

      // const { data } = await fetch(`http://localhost:4000/api/alarm/complex/${settingApiRes.seq}`, {
      //   method: 'GET',
      // }).then((res) => res.json());
      // setComplexes(data);
      setLoading(false);
    })();
  }, []);

  const isValidData = () => {
    let valid = true;

    for (let i = 1; i <= 6; i++) {
      const onboardingData = window.localStorage.getItem(`on_data_${i}`);

      if (!onboardingData) {
        valid = false;
        break;
      }
    }

    if (!window.localStorage.getItem('on_data_user_seq')) {
      valid = false;
    }

    return valid;
  };

  const clearData = () => {
    window.localStorage.removeItem('on_page');
    window.localStorage.removeItem('on_data_user_seq');

    for (let i = 1; i <= 6; i++) {
      window.localStorage.removeItem(`on_data_${i}`);
    }
  };

  return (
    <Layout
      des={loading ? '알림 설정중...' : '알림 설정 완료!'}
      isNext
      loading={loading}
      isOnlyNext
      nextName="확인했어요"
      nextOnClick={() => {
        router.replace('/');
      }}
    >
      {loading ? (
        <FetchLoading />
      ) : (
        <>
          <div>조건에 맞는 공고를 아래와 같이 보낼게요</div>
          <Image
            className="rounded-lg mt-lg"
            src="/static/images/ex_talk.png"
            alt="로고"
            width={300}
            height={200}
          />
        </>
      )}
    </Layout>
  );
}
