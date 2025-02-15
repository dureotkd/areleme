'use client';

import React from 'react';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

import Layout from './Layout';
import SelectedDisplay from './SelectedDisplay';
import FetchLoading from '../../components/FetchLoading';
import ViewButton from './ViewButton';

import { wait } from '../../helpers/time';
import Choco from '../../helpers/choco';
import ApiErrorBoundary from './ApiErrorBoundary';

export default function CompletedAlarmSetting() {
  const router = useRouter();

  const [loadingStep, setLoadingStep] = React.useState<string>('setting');

  const loadingStepText = React.useMemo(() => {
    if (!loadingStep) {
      return '알림 설정중..';
    }

    return {
      setting: '설정을 저장하고 있어요..',
      'complex-search': '단지 정보를 조회하고 있어요..',
      'complex-unit-search': '단지별 매물을 조회하고 있어요..',
      'platform-search': '플랫폼 매물을 조회하고 있어요..',
      finish: '알림 설정 완료!!',
    }[loadingStep];
  }, [loadingStep]);

  return (
    <Layout
      des={loadingStepText}
      isNext
      loading={loadingStep === 'finish' ? false : true}
      isOnlyNext
      nextName="확인했어요"
      nextOnClick={() => {
        router.replace('/');
      }}
    >
      <SelectedDisplay />
      <ApiErrorBoundary>
        <CompletedFetcher loadingStep={loadingStep} setLoadingStep={setLoadingStep} />
      </ApiErrorBoundary>
    </Layout>
  );
}

function CompletedFetcher({ loadingStep, setLoadingStep }) {
  const router = useRouter();

  const [complexes, setComplexes] = React.useState<[]>([]);
  const [error, setError] = React.useState<string>('');

  React.useEffect(() => {
    (async () => {
      if (!isValidData()) {
        alert('알림이 완성되어 홈화면으로 돌아갑니다');
        router.replace('/');
        return;
      }

      const estateType = window.localStorage.getItem('on_data_1');
      const tradeType = window.localStorage.getItem('on_data_2');
      const local = window.localStorage.getItem('on_data_3');
      const region = window.localStorage.getItem('on_data_4');
      const dong = window.localStorage.getItem('on_data_5');
      const details = window.localStorage.getItem('on_data_6');
      const selectCodes = window.localStorage.getItem('on_data_8');
      const recommendType = window.localStorage.getItem('on_data_7');
      const userSeq = window.localStorage.getItem('on_data_user_seq');

      const params = {
        recommendType: recommendType,
        estateType: estateType,
        tradeType: tradeType,
        local: local,
        region: region,
        dong: dong,
        details: JSON.parse(details),
        selectCodes: JSON.parse(selectCodes),
      };

      const settingApiRes = await Choco({
        url: `setting`,
        options: {
          method: 'POST',
          body: JSON.stringify({
            userSeq: userSeq, // 필요한 userSeq 값
            params: params, // 필요한 params 값
          }),
        },
      }).catch((e: Error) => {
        if (e.message.includes('동일한 조건')) {
          alert(e.message);
          window.location.replace('/onboarding/6');
        } else {
          setError(e.message);
        }
      });

      await wait(1500);

      const settingSeq = settingApiRes.seq;
      let intervalRes: ReturnType<typeof setInterval>;

      if (estateType === 'apt' || estateType === 'op') {
        setLoadingStep('complex-search');

        intervalRes = setInterval(async () => {
          const { data } = await Choco({
            url: `alarm/complex/${settingSeq}`,
          }).catch((e: Error) => {
            setError(e.message);
          });

          if (data.length > 0) {
            setLoadingStep('complex-unit-search');
          }

          setComplexes(data);
        }, 2000);

        await wait(2000);
      } else {
        setLoadingStep('platform-search');

        await wait(2000);
      }

      const alarmRes = await Choco({
        url: 'alarm',
        options: {
          method: 'POST',
          body: JSON.stringify({
            settingSeq: settingSeq,
          }),
        },
      })
        .catch((e) => {
          setError(e.message);
        })
        .finally(() => {
          clearInterval(intervalRes);
        });

      if (alarmRes.code === 'success') {
        await wait(2000);

        setLoadingStep('finish');
        // clearData();
      }
    })();
  }, [router, setComplexes, setLoadingStep]);

  const isValidData = () => {
    let valid = true;

    for (let i = 1; i <= 8; i++) {
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

    for (let i = 1; i <= 8; i++) {
      window.localStorage.removeItem(`on_data_${i}`);
    }
  };

  if (error) {
    throw new Error(error);
  }

  if (loadingStep === 'setting' || loadingStep === 'complex-search' || loadingStep === 'platform-search') {
    return <FetchLoading />;
  }

  return (
    <motion.ul
      variants={{
        hidden: {
          opacity: 0,
        },
        visible: {
          opacity: 1,
          transition: {
            when: 'beforeChildren',
            staggerChildren: 0.2,
          },
        },
      }}
      initial="hidden"
      animate="visible"
      className="flex flex-wrap mt-sm"
    >
      {complexes.map((complex: any) => {
        return (
          <motion.li
            variants={{
              hidden: { opacity: 0, y: 50 },
              visible: { opacity: 1, y: 0 },
            }}
            className="mr-sm"
            key={`complex-${complex.seq}`}
          >
            <ViewButton className="mt-sm" name={complex.name} />
          </motion.li>
        );
      })}
      {loadingStep === 'complex-unit-search' && <FetchLoading className="max-w-[180px] !justify-start" />}
    </motion.ul>
  );
}
