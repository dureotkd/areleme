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

export default function CompletedAlarmSetting() {
  const router = useRouter();

  const [loadingStep, setLoadingStep] = React.useState<string>('');
  const [realLoading, setRealLoading] = React.useState<boolean>(true);

  const [complexes, setComplexes] = React.useState<[]>([]);

  React.useEffect(() => {
    (async () => {
      if (!isValidData()) {
        router.replace('/');
        return;
      }

      const recommendType = window.localStorage.getItem('on_data_0');
      const estateType = window.localStorage.getItem('on_data_1');
      const tradeType = window.localStorage.getItem('on_data_2');
      const local = window.localStorage.getItem('on_data_3');
      const region = window.localStorage.getItem('on_data_4');
      const dong = window.localStorage.getItem('on_data_5');
      const details = window.localStorage.getItem('on_data_6');
      const selectCodes = window.localStorage.getItem('on_data_7');
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
        url: 'http://localhost:4000/api/setting',
        options: {
          method: 'POST',
          body: JSON.stringify({
            userSeq: userSeq, // 필요한 userSeq 값
            params: params, // 필요한 params 값
          }),
        },
      });

      if (!settingApiRes.ok) {
        alert(settingApiRes.msg);
        return;
      }

      const settingSeq = settingApiRes.seq;
      let intervalRes: any = {};

      if (estateType === 'apt' || estateType === 'op') {
        setLoadingStep('complex-search');

        intervalRes = setInterval(async () => {
          try {
            const { data } = await Choco({
              url: `http://localhost:4000/api/alarm/complex/${settingSeq}`,
            });

            setComplexes(data);
          } catch (error) {
            console.log(error);
          }
        }, 1000);

        await wait(5000);

        setLoadingStep('complex-unit-search');
      } else {
        setLoadingStep('platform-search');

        await wait(3000);
      }

      await Choco({
        url: 'http://localhost:4000/api/alarm',
        options: {
          method: 'POST',
          body: JSON.stringify({
            settingSeq: settingSeq,
          }),
        },
        final: () => {
          setLoadingStep('finish');
          clearInterval(intervalRes);
        },
      });
    })();
  }, []);

  const isValidData = () => {
    let valid = true;

    for (let i = 0; i <= 6; i++) {
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

  const loadingStepText = React.useMemo(() => {
    if (!loadingStep) {
      return '알림 설정중..';
    }

    return {
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
      {loadingStep === '' ? (
        <FetchLoading />
      ) : (
        <>
          <SelectedDisplay />
          {}
          {loadingStep === 'complex-search' && <FetchLoading />}
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
          </motion.ul>
        </>
      )}
    </Layout>
  );
}
