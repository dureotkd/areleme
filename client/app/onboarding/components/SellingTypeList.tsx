'use client';

import { useRouter } from 'next/navigation';

import React from 'react';

import Layout from './Layout';
import SelectButton from './SelectButton';
import SelectedDisplay from './SelectedDisplay';

import useRedirectPrevData from '../hooks/useRedirectPrevData';

export default function SellingTypeList(props: { page: string }) {
  const router = useRouter();

  useRedirectPrevData(props.page);

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
      <SelectedDisplay className="mb-md" />
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
              const on_data_name = JSON.parse(window.localStorage.getItem('on_data_name'));
              on_data_name[parseInt(props.page) - 1] = item.name;
              window.localStorage.setItem('on_data_name', JSON.stringify(on_data_name));
              router.push(`/onboarding/${Number(props.page) + 1}`);
            }}
          />
        );
      })}
    </Layout>
  );
}
