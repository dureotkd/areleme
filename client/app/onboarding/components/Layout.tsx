'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  des: React.ReactNode;
  children: React.ReactNode;
  isNext?: boolean;
  loading?: boolean;
  isOnlyNext?: boolean;
  nextName?: string;
  nextOnClick?: React.MouseEventHandler;
  prevOnClick?: React.MouseEventHandler;
};

const Layout = ({
  des,
  children,
  loading = false,
  isNext,
  isOnlyNext = false,
  nextName = '다음',
  nextOnClick,
  prevOnClick,
}: Props) => {
  const router = useRouter();

  return (
    <div className="md:p-xl flex flex-col w-full h-full overflow-x-visible min-h-screen items-start pt-lg pb-lg pl-lg relative">
      <h2 className="font-semibold text-3xl text-left">{des}</h2>
      <div className="w-full h-full mt-md text-left justify-start">{children}</div>
      {loading === false &&
        (isNext ? (
          <div className="w-full fixed bottom-0 flex h-12 text-primary max-w-[540px] translate-x-center left-1/2">
            {!isOnlyNext && (
              <button
                className="w-1/4 h-full flex justify-center items-center bg-danger"
                type="button"
                onClick={() => {
                  router.back();
                }}
              >
                이전
              </button>
            )}
            <button
              className={`${
                isOnlyNext ? 'w-full' : 'w-3/4'
              } h-full flex justify-center items-center bg-primary`}
              type="button"
              onClick={nextOnClick}
            >
              {nextName}
            </button>
          </div>
        ) : (
          <button
            className="w-full fixed bottom-0 bg-danger h-12 text-primary max-w-[540px] translate-x-center left-1/2"
            type="button"
            onClick={(event) => {
              prevOnClick && prevOnClick(event);

              const page = window.localStorage.getItem('on_page');
              const onDataNames = window.localStorage.getItem('on_data_name');

              window.localStorage.removeItem(`on_data_${page}`);
              window.localStorage.setItem('on_page', String(parseInt(page) - 1));

              const newNames = JSON.parse(onDataNames).filter((item, index) => {
                return page != index + 1;
              });

              window.localStorage.setItem('on_data_name', JSON.stringify(newNames));

              router.back();
            }}
          >
            이전
          </button>
        ))}
    </div>
  );
};

export default Layout;
