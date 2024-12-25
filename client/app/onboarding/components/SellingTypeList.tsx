'use client';

import { useRouter } from 'next/navigation';

import Layout from './Layout';
import SelectButton from './SelectButton';

export default function SellingTypeList(props: { page: string }) {
  const router = useRouter();

  return (
    <Layout
      des={
        <>
          거래유형을
          <br />
          선택해주세요
        </>
      }
    >
      {[
        { code: 'sell', name: '매매' },
        { code: 'lease', name: '전세' },
        { code: 'monthlyRent', name: '월세' },
      ].map((item) => {
        return (
          <SelectButton
            key={item.code}
            code={item.code}
            name={item.name}
            onClick={() => {
              window.localStorage.setItem('on_page', props.page);
              window.localStorage.setItem(`on_data_${props.page}`, item.code);
              router.push(`/onboarding/${Number(props.page) + 1}`);
            }}
          />
        );
      })}
    </Layout>
  );
}
