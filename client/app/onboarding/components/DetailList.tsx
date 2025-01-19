'use client';

import RangeSlider from '../../components/RangeSlider';
import { useEffect, useMemo, useState } from 'react';

import Layout from './Layout';
import FetchLoading from '../../components/FetchLoading';
import number from '../helpers/number';
import { useRouter } from 'next/navigation';
import useRedirectPrevData from '../hooks/useRedirectPrevData';
import SelectedDisplay from './SelectedDisplay';

const RENT_MIN_COST = 100000;
const RENT_MAX_COST = 2000000;
const RENT_STEP = 50000;

const MIN_PYEONG = 10;
const MAX_PYEONG = 61;

export default function DetailList(props: { page: string }) {
  const router = useRouter();

  const [loading, setLoading] = useState<boolean>(true);

  const [sellingType, setSellingType] = useState<string>('');

  const [costStep, setCostStep] = useState<number>(0);
  const [costRange, setCostRange] = useState<number[]>([]);

  const [cost, setCost] = useState<number[]>([0, 0]);
  const [rentCost, setRentCost] = useState<number[]>([RENT_MIN_COST, RENT_MAX_COST]);
  const [pyeong, setPyeong] = useState<number[]>([MIN_PYEONG, MAX_PYEONG]);

  const costRangeText = useMemo(() => formatCostRange(cost, costRange), [cost, costRange]);
  const rentCostRangeText = useMemo(
    () => formatCostRange(rentCost, [RENT_MIN_COST, RENT_MAX_COST]),
    [rentCost],
  );
  const pyeongRangeText = useMemo(() => formatPyeongRange(pyeong), [pyeong]);

  useRedirectPrevData(props.page);

  useEffect(() => {
    (() => {
      const sellingType = window.localStorage.getItem('on_data_2') as string;

      switch (sellingType) {
        case 'monthlyRent':
          setCostStep(500000);
          setCost([0, 30000000]);
          setCostRange([0, 30000000]);

          break;

        case 'lease':
        case 'sell':
          setCostStep(20000000);
          setCost([0, 1000000001]);
          setCostRange([0, 1000000001]);

          break;
      }

      setSellingType(sellingType);
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
      isNext
      nextOnClick={() => {
        window.localStorage.setItem('on_page', props.page);
        window.localStorage.setItem(
          `on_data_${props.page}`,
          JSON.stringify({
            cost: cost,
            rentCost: rentCost,
            pyeong,
          }),
        );
        router.push(`/onboarding/${Number(props.page) + 1}`);
      }}
    >
      {loading ? (
        <FetchLoading />
      ) : (
        <>
          <SelectedDisplay className="mb-md" />
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
                <p className="mt-md text-tiny text-blue-400">{costRangeText}</p>
              </div>
              <div className="flex w-full justify-around">
                <RangeSlider
                  className="mt-sm"
                  style={{ width: '95%' }}
                  value={cost}
                  step={costStep}
                  min={costRange[0]}
                  max={costRange[1]}
                  onChange={(value) => {
                    setCost(value as any);
                  }}
                />
              </div>
              <div className="flex justify-between text-tiny">
                <span className="text-silver">최소</span>
                <span className="text-silver">최대</span>
              </div>
              {sellingType === 'monthlyRent' && (
                <>
                  <div className="flex justify-between mt-md">
                    <p className="mt-md text-tiny">월세</p>
                    <p className="mt-md text-tiny text-blue-400">{rentCostRangeText}</p>
                  </div>
                  <div className="flex w-full justify-around">
                    <RangeSlider
                      className="mt-sm"
                      style={{ width: '95%' }}
                      value={rentCost}
                      step={RENT_STEP}
                      min={RENT_MIN_COST}
                      max={RENT_MAX_COST}
                      onChange={(value) => {
                        setRentCost(value as any);
                      }}
                    />
                  </div>

                  <div className="flex justify-between text-tiny">
                    <span className="text-silver">최소</span>
                    <span className="text-silver">최대</span>
                  </div>
                </>
              )}
            </div>
            <div className="mt-lg">
              <h3 className="font-semibold">방크기</h3>
              <div className="flex justify-between">
                <p className="mt-md text-tiny"></p>
                <p className="mt-md text-tiny text-blue-400">{pyeongRangeText}</p>
              </div>
              <div className="flex w-full justify-around">
                <RangeSlider
                  className="mt-sm"
                  style={{ width: '95%' }}
                  value={pyeong}
                  step={5}
                  min={MIN_PYEONG}
                  max={MAX_PYEONG}
                  onChange={(value) => {
                    setPyeong(value as any);
                  }}
                />
              </div>
              <div className="flex justify-between text-tiny">
                <span className="text-silver text-center">
                  10평
                  <br />
                  이하
                </span>
                <span className="text-silver text-center">
                  60평
                  <br />
                  이상
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Layout>
  );
}

function formatCostRange(value: number[], costRange: number[]) {
  const MIN_COST = costRange[0];
  const MAX_COST = costRange[1];
  const costRangeText = [];

  if (value[0] > MIN_COST) {
    costRangeText.push(number.convertToKoreanWon(value[0]));
  }

  if (value[1] < MAX_COST) {
    costRangeText.push(number.convertToKoreanWon(value[1]));
  }

  if (value[0] > MIN_COST && value[1] === MAX_COST) {
    costRangeText[1] = `무제한`;
  }

  if (costRangeText.length > 0) {
    return costRangeText.join(' ~ ');
  }

  if (value[0] === MIN_COST && value[1] === MAX_COST) {
    return '무제한';
  }
}

function formatPyeongRange(value: number[]) {
  const pyeongRangeText = [];

  console.log(value);

  if (value[0] > MIN_PYEONG) {
    pyeongRangeText.push(`${value[0]}평`);
  }

  if (value[1] < MAX_PYEONG) {
    pyeongRangeText.push(`${value[1]}평`);
  }

  if (value[0] > MIN_PYEONG && value[1] === MAX_PYEONG) {
    pyeongRangeText[1] = '60평 이상';
  }

  if (pyeongRangeText.length > 0) {
    return pyeongRangeText.join(' ~ ');
  }

  if (value[0] === MIN_PYEONG && value[1] === MAX_PYEONG) {
    return '전체';
  }
}
