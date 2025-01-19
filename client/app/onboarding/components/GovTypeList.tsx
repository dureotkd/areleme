'use client';

import { useRouter } from 'next/navigation';

import Layout from './Layout';
import SelectButton from './SelectButton';

export default function GovTypeList(props: { page: string }) {
  const router = useRouter();

  return (
    <Layout
      des={
        <>
          매물유형을
          <br />
          선택해주세요
        </>
      }
    >
      {[
        { code: 'apt', name: '아파트' },
        { code: 'one', name: '원/투룸' },
        { code: 'villa', name: '주택/빌라' },
        { code: 'op', name: '오피스텔' },
      ].map((item) => {
        return (
          <SelectButton
            key={item.code}
            code={item.code}
            name={item.name}
            onClick={() => {
              window.localStorage.setItem('on_page', props.page);
              window.localStorage.setItem(`on_data_${props.page}`, item.code);
              window.localStorage.setItem('on_data_name', JSON.stringify([item.name]));
              router.push(`/onboarding/${Number(props.page) + 1}`);
            }}
          />
        );
      })}
    </Layout>
  );
}
