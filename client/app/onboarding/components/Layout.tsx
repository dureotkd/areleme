'use client';

import { useRouter } from 'next/navigation';

type Props = {
  des: React.ReactNode;
  children: React.ReactNode;
};

const Layout = ({ des, children }: Props) => {
  const router = useRouter();

  return (
    <div className="flex flex-col w-full h-full overflow-x-visible min-h-screen items-start p-xl relative">
      <h2 className="font-semibold text-3xl text-left">{des}</h2>
      <div className="w-full h-full mt-md text-left justify-start">{children}</div>
      <button
        className="w-full fixed bottom-0 bg-danger h-12 text-primary max-w-[540px] translate-x-center left-1/2"
        type="button"
        onClick={() => {
          router.back();
        }}
      >
        이전
      </button>
    </div>
  );
};

export default Layout;
