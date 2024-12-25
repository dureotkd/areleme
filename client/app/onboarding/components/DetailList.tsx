'use client';

import Layout from './Layout';

import RangeSlider from '../../components/RangeSlider';
import { useEffect, useMemo, useState } from 'react';
import FetchLoading from '../../components/FetchLoading';

export default function DetailList(props: { page: string }) {
  const [loading, setLoading] = useState<boolean>(true);
  const [sellingType, setSellingType] = useState<string>('');

  const [value, setValue] = useState<number[]>([0, 1000000001]);
  const [costRange1, setCostRange1] = useState<string[]>([]);

  const costRange1Text = useMemo(() => {
    return '무제한';
  }, [costRange1]);

  useEffect(() => {
    (() => {
      setSellingType(window.localStorage.getItem('on_data_2') as string);
      setLoading(false);
    })();
  }, []);

  return (
    <Layout
      des={
        <>
          세부사항을
          <br />
          선택해주세요
        </>
      }
    >
      {loading ? (
        <FetchLoading />
      ) : (
        <>
          <div>
            <div>
              <h3 className="font-semibold">가격</h3>
              <div className="flex justify-between">
                <p className="mt-md text-tiny">
                  {
                    {
                      sell: '매매금액',
                      lease: '전세금',
                      monthlyRent: '보증금',
                    }[sellingType]
                  }
                </p>
                <p className="mt-md text-tiny text-blue-400">{costRange1Text}</p>
              </div>
              <div className="flex w-full justify-around">
                <RangeSlider
                  className="mt-sm"
                  style={{ width: '95%' }}
                  value={value}
                  setValue={setValue}
                  step={10000000}
                  min={0}
                  max={1000000001}
                  onChange={(value) => {
                    console.log(value);
                  }}
                />
              </div>
              <div className="flex justify-between text-tiny">
                <span className="text-silver">최소</span>
                <span className="text-silver">최대</span>
              </div>
            </div>
            <div className="mt-lg">
              <h3 className="font-semibold">방 크기</h3>
              <p className="mt-md text-sm">보증금(전세금)</p>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}
