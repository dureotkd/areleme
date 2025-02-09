'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import SelectButton from './SelectButton';
import Layout from './Layout';
import FetchLoading from '../../components/FetchLoading';
import useRedirectPrevData from '../hooks/useRedirectPrevData';
import SelectedDisplay from './SelectedDisplay';

import Choco from '../../helpers/choco';

type Local = {
  seq: number;
  code: string;
  lat: string;
  lng: string;
  name: string;
};

export default function LocalList(props: { page: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Local[]>([]);

  useRedirectPrevData(props.page);

  useEffect(() => {
    (async () => {
      const { data } = await Choco({
        url: 'http://localhost:4000/api/address/local',
        options: {
          method: 'GET', // 필요한 HTTP 메소드와 기타 옵션
        },
        final: () => {
          setLoading(false);
        },
      });

      setList(data);
    })();
  }, []);

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
      {loading && <FetchLoading />}
      {list.length > 0 &&
        list.map((item) => {
          return (
            <SelectButton
              key={item.seq}
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
