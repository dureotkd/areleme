'use client';

import { useRouter } from 'next/navigation';

import Layout from './Layout';
import SelectButton from './SelectButton';
import Image from 'next/image';

export default function GovTypeList(props: { page: string }) {
  const router = useRouter();

  return (
    <Layout
      des={
        <>
          알림을 어떻게
          <br />
          받으실래요?
        </>
      }
    >
      <div className="flex flex-wrap">
        {[
          { code: 'all', name: '새로운 매물을 모두 알려줘' },
          { code: 'ai', name: '괜찮은 매물만 알려줘 (추천)' },
        ].map((item) => {
          return (
            <div className="relative" key={item.code}>
              <SelectButton
                code={item.code}
                name={item.name}
                onClick={() => {
                  window.localStorage.setItem('on_page', props.page);
                  window.localStorage.setItem(`on_data_${props.page}`, item.code);
                  router.push(`/onboarding/${Number(props.page) + 1}`);
                }}
              />
              {item.code === 'ai' && (
                <Image
                  className="absolute -top-2 right-2"
                  src="/static/images/star.png"
                  alt="recommend-star"
                  width={18}
                  height={18}
                />
              )}
            </div>
          );
        })}
      </div>
    </Layout>
  );
}
