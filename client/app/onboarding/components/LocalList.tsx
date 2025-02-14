'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ApiErrorBoundary from './ApiErrorBoundary';
import SelectButton from './SelectButton';
import Layout from './Layout';
import FetchLoading from '../../components/FetchLoading';
import SelectedDisplay from './SelectedDisplay';

import useRedirectPrevPage from '../hooks/useRedirectPrevPage';

import Choco from '../../helpers/choco';

type LocalType = {
  seq: number;
  code: string;
  lat: string;
  lng: string;
  name: string;
};

export default function LocalList(props: { page: string }) {
  useRedirectPrevPage(props.page);

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
        <LocalListFetcher page={props.page} />
      </ApiErrorBoundary>
    </Layout>
  );
}

function LocalListFetcher({ page }) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [list, setList] = useState<LocalType[]>([]);

  useEffect(() => {
    (async () => {
      const { data } = await Choco({
        url: 'address/local',
        options: {
          method: 'GET',
        },
        final: () => {
          setLoading(false);
        },
      }).catch((e) => {
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
