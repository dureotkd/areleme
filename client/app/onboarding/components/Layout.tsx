'use client';

import { useRouter } from 'next/navigation';
import React from 'react';

type Props = {
  des: React.ReactNode;
  children: React.ReactNode;
  isNext?: boolean;
  isOnlyNext?: boolean;
  nextName?: string;
  nextOnClick?: React.MouseEventHandler;
};

const Layout = ({ des, children, isNext, isOnlyNext = false, nextName = '다음', nextOnClick }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full overflow-x-visible min-h-screen items-start p-xl relative">
      <h2 className="font-semibold text-3xl text-left">{des}</h2>
      <div className="w-full h-full mt-md text-left justify-start">{children}</div>
      {isNext ? (
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
          onClick={() => {
            router.back();
          }}
        >
          이전
        </button>
      )}
    </div>
  );
};

export default Layout;
