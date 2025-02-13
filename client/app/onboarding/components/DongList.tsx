'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import Layout from './Layout';
import SelectButton from './SelectButton';
import FetchLoading from '../../components/FetchLoading';
import SelectedDisplay from './SelectedDisplay';

import Choco from '../../helpers/choco';

type Dong = {
  seq: number;
  code: string;
  name: string;
};

export default function DongList(props: { page: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [list, setList] = useState<Dong[]>([]);

  useEffect(() => {
    (async () => {
      const regionCode = window.localStorage.getItem('on_data_4');

      const { data } = await Choco({
        url: `address/dong/${regionCode}`,
        options: {
          method: 'GET', // HTTP 메소드와 필요한 옵션을 지정
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
