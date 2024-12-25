'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Layout from './Layout';
import SelectButton from './SelectButton';
import FetchLoading from '../../components/FetchLoading';

type Region = {
  seq: number;
  code: string;
  name: string;
};

export default function RegionList(props: { page: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Region[]>([]);

  useEffect(() => {
    (async () => {
      const localCode = window.localStorage.getItem('on_data_3');

      const { data } = await fetch(`http://localhost:4000/api/address/region/${localCode}`)
        .then((res) => res.json())
        .finally(() => {
          setLoading(false);
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
                router.push(`/onboarding/${Number(props.page) + 1}`);
              }}
            />
          );
        })}
    </Layout>
  );
}
