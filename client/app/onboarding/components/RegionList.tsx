'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Layout from './Layout';
import ApiErrorBoundary from './ApiErrorBoundary';
import SelectButton from './SelectButton';
import FetchLoading from '../../components/FetchLoading';
import SelectedDisplay from './SelectedDisplay';

import useRedirectPrevData from '../hooks/useRedirectPrevPage';

import Choco from '../../helpers/choco';

type RegionType = {
  seq: number;
  code: string;
  name: string;
};

export default function RegionList(props: { page: string }) {
  useRedirectPrevData(props.page);

  return (
    <Layout
      des={
        <>
          지역을
          <br />
          선택해주세요
        </>
      }
    >
      <SelectedDisplay className="mb-md" />
      <ApiErrorBoundary>
        <RegionListFetcher page={props.page} />
      </ApiErrorBoundary>
    </Layout>
  );
}

function RegionListFetcher({ page }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [list, setList] = useState<RegionType[]>([]);

  useEffect(() => {
    (async () => {
      const localCode = window.localStorage.getItem('on_data_3');

      const { data } = await Choco({
        url: `address/region/${localCode}`,
        options: {
          method: 'GET', // HTTP 메소드와 필요한 옵션을 지정
        },
        final: () => {
          setLoading(false);
        },
      }).catch((e: Error) => {
        setError(e.message);
      });

      setList(data);
    })();
  }, []);

  if (error) {
    throw new Error(error);
  }

  if (loading) {
    return <FetchLoading />;
  }

  return list.map((item) => {
    return (
      <SelectButton
        key={item.seq}
        code={item.code}
        name={item.name}
        onClick={() => {
          window.localStorage.setItem('on_page', page);
          window.localStorage.setItem(`on_data_${page}`, item.code);
          const on_data_name = JSON.parse(window.localStorage.getItem('on_data_name'));
          on_data_name[parseInt(page) - 1] = item.name;
          window.localStorage.setItem('on_data_name', JSON.stringify(on_data_name));
          router.push(`/onboarding/${Number(page) + 1}`);
        }}
      />
    );
  });
}
